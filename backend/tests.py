import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from main import register_user, login_user
from main import UserCreate, UserLogin, User
from main import create_tour, TourCreate, Tour, register_to_tour, get_tour_participants, delete_tour, update_tour, TourUpdate
from main import get_exhibitions, get_exhibition, search_exhibitions, get_museum_info, get_events

def test_register_user_success():
    mock_db = MagicMock()
    user_data = UserCreate(username="john", email="john@example.com", password="123", role="visitor")
    mock_db.query().filter().first.return_value = None

    response = register_user(user_data, db=mock_db)

    assert response["message"] == "נרשמת בהצלחה!"
    assert response["role"] == "visitor"
    mock_db.add.assert_called()
    mock_db.commit.assert_called()

def test_register_user_existing_email():
    mock_db = MagicMock()
    user_data = UserCreate(username="john", email="john@example.com", password="123", role="visitor")
    mock_db.query().filter().first.return_value = User()

    with pytest.raises(HTTPException) as exc_info:
        register_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400
    assert "האימייל כבר קיים במערכת" in exc_info.value.detail

def test_register_user_default_role():
    mock_db = MagicMock()
    user_data = UserCreate(username="sara", email="sara@example.com", password="456")
    mock_db.query().filter().first.return_value = None

    response = register_user(user_data, db=mock_db)

    assert response["message"] == "נרשמת בהצלחה!"
    assert response["role"] == "visitor"
    mock_db.add.assert_called()
    mock_db.commit.assert_called()

def test_login_user_success():
    mock_db = MagicMock()
    user_data = UserLogin(email="john@example.com", password="123")

    fake_user = MagicMock()
    fake_user.id = 1
    fake_user.username = "john"
    fake_user.email = "john@example.com"
    fake_user.password = "123"
    fake_user.role = "admin"
    mock_db.query().filter_by().first.return_value = fake_user

    response = login_user(user_data, db=mock_db)

    assert response["username"] == "john"
    assert response["role"] == "admin"

def test_login_user_invalid_credentials():
    mock_db = MagicMock()
    user_data = UserLogin(email="wrong@example.com", password="wrong")
    mock_db.query().filter_by().first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        login_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400

def test_login_user_wrong_password():
    mock_db = MagicMock()
    user_data = UserLogin(email="john@example.com", password="wrongpass")
    mock_db.query().filter_by().first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        login_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400

def test_create_tour_success():
    mock_db = MagicMock()
    mock_db.add = MagicMock()
    mock_db.commit = MagicMock()
    mock_db.refresh = MagicMock()

    tour_data = TourCreate(
        guide_id=1,
        name="סיור לדוגמה",
        description="סיור מעניין",
        exhibitions=[1, 2, 3],
        tour_date="2025-07-01"
    )

    response = create_tour(tour_data, db=mock_db)

    assert "נוצר בהצלחה" in response["message"]
    mock_db.add.assert_called()
    mock_db.commit.assert_called()

def test_register_to_tour_user_not_found():
    mock_db = MagicMock()
    mock_db.query().filter_by().first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        register_to_tour(tour_id=1, visitor_email="notfound@example.com", db=mock_db)

    assert exc_info.value.status_code == 400
    assert "משתמש לא קיים" in exc_info.value.detail

def test_register_to_tour_not_visitor():
    mock_db = MagicMock()
    fake_user = MagicMock()
    fake_user.id = 2
    fake_user.email = "admin@example.com"
    fake_user.role = "admin"
    mock_db.query().filter_by().first.return_value = fake_user

    with pytest.raises(HTTPException) as exc_info:
        register_to_tour(tour_id=1, visitor_email="admin@example.com", db=mock_db)

    assert exc_info.value.status_code == 400
    assert "משתמש לא קיים או לא מבקר" in exc_info.value.detail

def test_register_to_tour_success():
    mock_db = MagicMock()
    fake_user = MagicMock()
    fake_user.id = 3
    fake_user.email = "visitor@example.com"
    fake_user.role = "visitor"
    fake_user.username = "VisitorUser"
    mock_db.query().filter_by().first.return_value = fake_user

    response = register_to_tour(tour_id=5, visitor_email="visitor@example.com", db=mock_db)

    assert "נרשם לסיור" in response["message"]
    mock_db.add.assert_called()
    mock_db.commit.assert_called()

def test_get_tour_participants():
    mock_db = MagicMock()

    reg_query = MagicMock()
    user_query = MagicMock()

    reg_query.filter_by().all.return_value = [
        MagicMock(user_id=1),
        MagicMock(user_id=2)
    ]

    user1 = MagicMock()
    user1.id = 1
    user1.username = "Alice"
    user1.email = "alice@example.com"

    user2 = MagicMock()
    user2.id = 2
    user2.username = "Bob"
    user2.email = "bob@example.com"

    user_query.filter().all.return_value = [user1, user2]

    def query_side_effect(model):
        if model.__name__ == "TourRegistration":
            return reg_query
        elif model.__name__ == "User":
            return user_query
        else:
            return MagicMock()

    mock_db.query.side_effect = query_side_effect

    participants = get_tour_participants(tour_id=1, db=mock_db)

    assert len(participants) == 2
    assert participants[0]["username"] == "Alice"
    assert participants[1]["email"] == "bob@example.com"

def test_delete_tour_success():
    mock_db = MagicMock()
    fake_tour = MagicMock(name="סיור שנמחק")
    mock_db.query().filter_by().first.return_value = fake_tour
    response = delete_tour(tour_id=1, db=mock_db)
    assert "נמחק בהצלחה" in response["message"]
    mock_db.delete.assert_called()
    mock_db.commit.assert_called()

def test_update_tour_success():
    mock_db = MagicMock()
    tour = MagicMock()
    mock_db.query().filter_by().first.return_value = tour
    update_data = TourUpdate(name="עודכן", description="טסט", exhibitions=[1], tour_date="2025-09-01")
    response = update_tour(tour_id=1, updated=update_data, db=mock_db)
    assert "עודכן בהצלחה" in response["message"]
    mock_db.commit.assert_called()

def test_get_exhibitions():
    exhibitions = get_exhibitions()
    assert isinstance(exhibitions, list)
    assert len(exhibitions) > 0

def test_get_exhibition_found():
    exhibition = get_exhibition(ex_id=1)
    assert exhibition["id"] == 1

def test_get_exhibition_not_found():
    with pytest.raises(HTTPException) as exc:
        get_exhibition(ex_id=9999)
    assert exc.value.status_code == 404

def test_search_exhibitions():
    results = search_exhibitions(q="צלולים")
    assert all("צלולים" in r["title"] for r in results)

def test_get_museum_info():
    info = get_museum_info()
    data = info.model_dump()
    assert "opening_hours" in data
    assert "services" in data
    assert "description" in data

def test_get_events():
    ev = get_events()
    assert isinstance(ev, list)
    assert len(ev) >= 1

def test_login_visitor_success():
    mock_db = MagicMock()
    user_data = UserLogin(email="visitor@example.com", password="123")
    fake_user = User(id=3, username="visitor", email="visitor@example.com", password="123", role="visitor")
    mock_db.query().filter_by().first.return_value = fake_user
    response = login_user(user_data, db=mock_db)
    assert response["username"] == "visitor"
    assert response["role"] == "visitor"
