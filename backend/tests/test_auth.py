from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_google_auth_url():
    response = client.get("/api/auth/google/url")
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
    assert "accounts.google.com" in data["url"]

def test_mock_login_and_get_me():
    # Login with mock user to acquire session_token cookie
    login_res = client.get("/api/auth/mock-login", follow_redirects=False)
    assert login_res.status_code in [302, 307]
    assert "session_token" in login_res.cookies

    # Access /api/auth/me with session cookie
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert data["email"] == "user@gmail.com"
