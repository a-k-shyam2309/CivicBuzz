"""
CivicBuzz Auth API Tests
"""

import pytest


@pytest.mark.asyncio
async def test_health_and_root(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

    root_resp = await client.get("/")
    assert root_resp.status_code == 200


@pytest.mark.asyncio
async def test_user_registration_and_login(client):
    # 1. Register a new citizen
    reg_payload = {
        "email": "testcitizen@civicbuzz.in",
        "password": "Password@123",
        "full_name": "Test Citizen",
        "phone_number": "+919876543210",
        "role": "CITIZEN",
    }
    reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert reg_data["success"] is True
    assert "access_token" in reg_data["data"]

    # 2. Login with registered credentials
    login_payload = {
        "email": "testcitizen@civicbuzz.in",
        "password": "Password@123",
        "role": "citizen",
    }
    login_resp = await client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    token = login_data["data"]["access_token"]
    assert token is not None

    # 3. Access /auth/me with Bearer token
    me_resp = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["data"]["email"] == "testcitizen@civicbuzz.in"


@pytest.mark.asyncio
async def test_aadhaar_mock_verification(client):
    # Login as seeded citizen
    login_resp = await client.post("/api/v1/auth/login", json={
        "email": "citizen@civicbuzz.in",
        "password": "Citizen@123",
        "role": "citizen",
    })
    token = login_resp.json()["data"]["access_token"]

    # 1. Initiate Aadhaar
    init_resp = await client.post(
        "/api/v1/auth/aadhaar/initiate",
        json={"aadhaar_number": "123456789012"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert init_resp.status_code == 200
    init_data = init_resp.json()
    tx_id = init_data["data"]["transaction_id"]
    assert "XXXX-XXXX-9012" in init_data["data"]["masked_aadhaar"]

    # 2. Verify Aadhaar with Mock OTP
    verify_resp = await client.post(
        "/api/v1/auth/aadhaar/verify",
        json={"aadhaar_number": "123456789012", "otp_code": "123456", "transaction_id": tx_id},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert verify_resp.status_code == 200
    verify_data = verify_resp.json()
    assert verify_data["data"]["is_verified"] is True
