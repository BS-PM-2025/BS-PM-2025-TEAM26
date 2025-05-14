import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from main import register_user, login_user
from main import UserCreate, UserLogin, User


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
    fake_user = User(username="john", email="john@example.com", password="123", role="admin")
    mock_db.query().filter().first.return_value = fake_user

    response = login_user(user_data, db=mock_db)

    assert response["username"] == "john"
    assert response["role"] == "admin"


def test_login_user_invalid_credentials():
    mock_db = MagicMock()
    user_data = UserLogin(email="wrong@example.com", password="wrong")
    mock_db.query().filter().first.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        login_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400
    assert "אימייל או סיסמה שגויים" in exc_info.value.detail


def test_login_user_wrong_password():
    mock_db = MagicMock()
    user_data = UserLogin(email="john@example.com", password="wrongpass")
    correct_user = User(username="john", email="john@example.com", password="123", role="admin")

    mock_db.query().filter().first.return_value = None  # Simulate password mismatch

    with pytest.raises(HTTPException) as exc_info:
        login_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400
    assert "אימייל או סיסמה שגויים" in exc_info.value.detail