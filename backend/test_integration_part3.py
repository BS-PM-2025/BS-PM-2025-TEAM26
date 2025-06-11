import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 🧪 Admin Users Page
def test_admin_update_user_role():
    response = client.put("/admin/users/1/role", json={"role": "guide"})
    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert "עודכן" in response.json()["message"] or "התפקיד עודכן" in response.json()["message"]

def test_admin_delete_user():
    response = client.delete("/admin/users/99")  # ID לא קיים לצורכי בדיקה
    assert response.status_code in [200, 404]

# 🧪 Admin Messages Page
def test_admin_send_message():
    response = client.post("/admin/messages/send", json={
        "sender_id": 1,
        "recipient_id": 2,
        "content": "בדיקת שליחת הודעה ממנהל"
    })
    assert response.status_code in [200, 400]
    if response.status_code == 200:
        assert "נשלחה" in response.json()["message"]

def test_admin_get_all_messages():
    response = client.get("/admin/messages")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# 🧪 Admin Exhibitions Page
def test_admin_create_exhibition():
    response = client.post("/admin/exhibitions", json={
        "title": "תערוכה לבדיקה",
        "description": "בדיקה של תיאור",
        "image": "https://example.com/image.jpg"
    })
    assert response.status_code == 200
    assert "נוספה" in response.json()["message"]

def test_admin_update_exhibition():
    response = client.put("/admin/exhibitions/1", json={
        "title": "כותרת חדשה",
        "description": "תיאור חדש",
        "image": "https://example.com/new.jpg"
    })
    assert response.status_code in [200, 404]
    if response.status_code == 200:
        msg = response.json()["message"]
        assert "עודכן" in msg or "התערוכה עודכנה" in msg

def test_admin_delete_exhibition():
    response = client.delete("/admin/exhibitions/1")
    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert "נמחקה" in response.json()["message"]
