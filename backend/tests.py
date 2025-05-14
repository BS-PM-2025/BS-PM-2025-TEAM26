import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from main import register_user, login_user  # Import the functions from main.py
from main import UserCreate, UserLogin, User  # Import the necessary models

def test_register_user_success():
    # Arrange
    mock_db = MagicMock()
    user_data = UserCreate(username="john", email="john@example.com", password="123", role="visitor")
    mock_db.query().filter().first.return_value = None  # No existing user

    # Act
    response = register_user(user_data, db=mock_db)

    # Assert
    assert response["message"] == "נרשמת בהצלחה!"
    assert response["role"] == "visitor"
    mock_db.add.assert_called()
    mock_db.commit.assert_called()

def test_register_user_existing_email():
    # Arrange
    mock_db = MagicMock()
    user_data = UserCreate(username="john", email="john@example.com", password="123", role="visitor")
    mock_db.query().filter().first.return_value = User()  # Simulate existing user

    # Act + Assert
    with pytest.raises(HTTPException) as exc_info:
        register_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400
    assert "האימייל כבר קיים במערכת" in exc_info.value.detail

def test_login_user_success():
    # Arrange
    mock_db = MagicMock()
    user_data = UserLogin(email="john@example.com", password="123")
    fake_user = User(username="john", email="john@example.com", password="123", role="admin")
    mock_db.query().filter().first.return_value = fake_user

    # Act
    response = login_user(user_data, db=mock_db)

    # Assert
    assert response["username"] == "john"
    assert response["role"] == "admin"

def test_login_user_invalid_credentials():
    # Arrange
    mock_db = MagicMock()
    user_data = UserLogin(email="wrong@example.com", password="wrong")
    mock_db.query().filter().first.return_value = None

    # Act + Assert
    with pytest.raises(HTTPException) as exc_info:
        login_user(user_data, db=mock_db)

    assert exc_info.value.status_code == 400
    assert "אימייל או סיסמה שגויים" in exc_info.value.detail
