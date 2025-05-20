import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_register_user_integration():
    response = client.post("/register", json={
        "username": "integration_user",
        "email": "integration_user@example.com",
        "password": "pass123",
        "role": "visitor"
    })
    assert response.status_code == 200
    assert "נרשמת בהצלחה" in response.json()["message"]

def test_login_user_integration():
    response = client.post("/login", json={
        "email": "integration_user@example.com",
        "password": "pass123"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "integration_user"
    assert response.json()["role"] == "visitor"

def test_create_tour_integration():
    login = client.post("/login", json={
        "email": "integration_user@example.com",
        "password": "pass123"
    })
    user_id = login.json()["id"]

    response = client.post("/tours", json={
        "guide_id": user_id,
        "name": "סיור אינטגרציה",
        "description": "סיור אוטומטי",
        "exhibitions": [1, 2],
        "tour_date": "2025-08-01"
    })
    assert response.status_code == 200
    assert "נוצר בהצלחה" in response.json()["message"]

def test_register_to_tour_integration():
    # login again to get user ID
    login = client.post("/login", json={
        "email": "integration_user@example.com",
        "password": "pass123"
    })
    user_email = login.json()["email"]

    # get all tours
    tours = client.get("/tours")
    tour_id = tours.json()[-1]["id"]  # last created

    response = client.post(f"/tours/{tour_id}/register?visitor_email={user_email}")
    assert response.status_code == 200
    assert "נרשם לסיור" in response.json()["message"]

def test_get_participants_integration():
    tours = client.get("/tours").json()
    tour_id = tours[-1]["id"]
    response = client.get(f"/tours/{tour_id}/participants")
    assert response.status_code == 200
    assert any(p["email"] == "integration_user@example.com" for p in response.json())
