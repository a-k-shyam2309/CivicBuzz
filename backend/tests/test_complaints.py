"""
CivicBuzz Complaints & Citizen Resolution Lifecycle Tests
"""

import pytest


@pytest.mark.asyncio
async def test_complaint_lifecycle_and_citizen_verification(client):
    # 1. Login citizen
    cit_login = await client.post("/api/v1/auth/login", json={
        "email": "citizen@civicbuzz.in",
        "password": "Citizen@123",
        "role": "citizen",
    })
    cit_token = cit_login.json()["data"]["access_token"]

    # 2. Login admin
    adm_login = await client.post("/api/v1/auth/login", json={
        "email": "admin@civicbuzz.in",
        "password": "Admin@123",
        "role": "admin",
    })
    adm_token = adm_login.json()["data"]["access_token"]

    # 3. Create complaint
    create_resp = await client.post(
        "/api/v1/complaints",
        json={
            "description": "Deep pothole causing severe traffic congestion near Janpath college gate.",
            "latitude": 20.2961,
            "longitude": 85.8245,
            "location_source": "CURRENT_LOCATION",
            "language": "en",
            "is_anonymous": False,
        },
        headers={"Authorization": f"Bearer {cit_token}"},
    )
    assert create_resp.status_code == 201
    comp_data = create_resp.json()["data"]
    cid = comp_data["complaint_id"]
    assert cid is not None
    assert comp_data["status"] == "ASSIGNED"
    assert comp_data["category"] == "ROAD"

    # 4. Department submits work completion evidence
    submit_res = await client.post(
        f"/api/v1/complaints/{cid}/submit-resolution",
        params={
            "work_description": "Filled pothole with fresh asphalt and leveled surface.",
            "after_image_url": "/uploads/after_fix.jpg",
        },
        headers={"Authorization": f"Bearer {adm_token}"},
    )
    assert submit_res.status_code == 200
    assert submit_res.json()["data"]["status"] == "READY_FOR_CITIZEN_VERIFICATION"

    # 5. Check verification status
    status_resp = await client.get(f"/api/v1/complaints/{cid}/verification-status")
    assert status_resp.status_code == 200
    assert status_resp.json()["data"]["ready_for_citizen_verification"] is True

    # 6. Citizen confirms resolution
    verify_resp = await client.post(
        f"/api/v1/complaints/{cid}/verify-resolution",
        params={
            "rating": 5,
            "comments": "Inspected on site, excellent asphalt patching work.",
        },
        headers={"Authorization": f"Bearer {cit_token}"},
    )
    assert verify_resp.status_code == 200
    assert verify_resp.json()["data"]["status"] == "RESOLVED"
    assert verify_resp.json()["data"]["qr_code_url"] is not None


@pytest.mark.asyncio
async def test_citizen_dispute_and_reopen(client):
    cit_login = await client.post("/api/v1/auth/login", json={
        "email": "citizen@civicbuzz.in",
        "password": "Citizen@123",
        "role": "citizen",
    })
    cit_token = cit_login.json()["data"]["access_token"]

    adm_login = await client.post("/api/v1/auth/login", json={
        "email": "admin@civicbuzz.in",
        "password": "Admin@123",
        "role": "admin",
    })
    adm_token = adm_login.json()["data"]["access_token"]

    # Submit complaint
    create_resp = await client.post(
        "/api/v1/complaints",
        json={
            "description": "Garbage dump near school entrance creating bad smell and hygiene risk.",
            "latitude": 20.2891,
            "longitude": 85.8432,
        },
        headers={"Authorization": f"Bearer {cit_token}"},
    )
    cid = create_resp.json()["data"]["complaint_id"]

    # Department marks work completed
    await client.post(
        f"/api/v1/complaints/{cid}/submit-resolution",
        params={"work_description": "Cleaned area", "after_image_url": "/uploads/demo.jpg"},
        headers={"Authorization": f"Bearer {adm_token}"},
    )

    # Citizen rejects / disputes the claimed resolution
    reject_resp = await client.post(
        f"/api/v1/complaints/{cid}/reject-resolution",
        params={"reason": "Garbage bin is still half full and waste is spilled on pavement."},
        headers={"Authorization": f"Bearer {cit_token}"},
    )
    assert reject_resp.status_code == 200
    assert reject_resp.json()["data"]["status"] == "RESOLUTION_REJECTED"


@pytest.mark.asyncio
async def test_department_cannot_directly_set_resolved(client):
    adm_login = await client.post("/api/v1/auth/login", json={
        "email": "admin@civicbuzz.in",
        "password": "Admin@123",
        "role": "admin",
    })
    adm_token = adm_login.json()["data"]["access_token"]

    # Submit complaint
    create_resp = await client.post(
        "/api/v1/complaints",
        json={
            "description": "Streetlight flickering and off on Janpath road.",
            "latitude": 20.2961,
            "longitude": 85.8245,
        },
        headers={"Authorization": f"Bearer {adm_token}"},
    )
    cid = create_resp.json()["data"]["complaint_id"]

    # Attempt to directly mark status = RESOLVED via PATCH
    patch_resp = await client.patch(
        f"/api/v1/complaints/{cid}",
        json={"status": "RESOLVED", "notes": "Officer trying to bypass citizen check"},
        headers={"Authorization": f"Bearer {adm_token}"},
    )
    # Must be rejected (401 or 403 or error)
    assert patch_resp.status_code in [400, 401, 403]

