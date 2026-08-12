import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def authenticate_client():
    client.get("/api/auth/mock-login", follow_redirects=False)

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "stats" in data
    assert "total_emails" in data["stats"]
    assert "recent_activity" in data

def test_emails_list():
    response = client.get("/api/emails?status=all")
    assert response.status_code == 200
    data = response.json()
    assert "emails" in data
    assert len(data["emails"]) > 0

def test_emails_crud():
    # Create email
    create_payload = {
        "recipient": "test@example.com",
        "subject": "Test Email",
        "body": "This is a test email body for CRUD testing.",
        "status": "draft",
        "category": "general"
    }
    create_res = client.post("/api/emails", json=create_payload)
    assert create_res.status_code == 200
    email_data = create_res.json().get("email")
    assert email_data is not None
    email_id = email_data["id"]

    # Update email
    update_payload = {
        "subject": "Updated Test Email",
        "body": "Updated body content."
    }
    update_res = client.put(f"/api/emails/{email_id}", json=update_payload)
    assert update_res.status_code == 200

    # Delete email
    delete_res = client.delete(f"/api/emails/{email_id}")
    assert delete_res.status_code == 200

def test_templates_crud():
    # Get templates
    get_res = client.get("/api/templates")
    assert get_res.status_code == 200
    templates = get_res.json().get("templates", [])
    assert len(templates) > 0

    # Create template
    create_tpl = {
        "name": "New Test Template",
        "subject_template": "Subject {test}",
        "body_template": "Body {test}",
        "category": "general"
    }
    create_res = client.post("/api/templates", json=create_tpl)
    assert create_res.status_code == 201
    tpl_id = create_res.json()["template"]["id"]

    # Delete template
    del_res = client.delete(f"/api/templates/{tpl_id}")
    assert del_res.status_code == 200

def test_ai_summarize():
    payload = {
        "subject": "Internship Interview Shortlist",
        "sender": "recruitments@techcorp.com",
        "body": "Congratulations! You have been shortlisted for our Data Science internship. Technical interview will be conducted on August 15 at 10:30 AM."
    }
    response = client.post("/api/ai/summarize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data

def test_ai_generate():
    payload = {
        "prompt": "Write a meeting request email",
        "tone": "Professional",
        "recipient": "john@corp.com",
        "category": "inquiry"
    }
    response = client.post("/api/ai/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "subject" in data
    assert "body" in data
