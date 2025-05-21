import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def login_user():
    login = client.post("/login", json={
        "email": "integration_user@example.com",
        "password": "pass123"
    })
    return login.json()["id"]

def get_last_tour_id():
    res = client.get("/tours")
    return res.json()[-1]["id"]

def test_send_message_to_tour_participants():
    sender_id = login_user()
    tour_id = get_last_tour_id()

    res = client.post(f"/tours/{tour_id}/send-message", json={
        "sender_id": sender_id,
        "content": "בדיקה: הודעה למשתתפים"
    })
    assert res.status_code == 200
    assert "נשלחה" in res.json()["message"]

def test_get_user_messages():
    user_id = login_user()

    res = client.get(f"/messages?user_id={user_id}")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_submit_feedback():
    user_id = login_user()
    tour_id = get_last_tour_id()

    res = client.post("/feedbacks", json={
        "tour_id": tour_id,
        "user_id": user_id,
        "content": "היה מדהים! תודה על הסיור!"
    })
    assert res.status_code == 200
    assert "נשלח" in res.json()["message"]

def test_get_feedbacks_for_tour():
    tour_id = get_last_tour_id()
    res = client.get(f"/tours/{tour_id}/feedbacks")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
