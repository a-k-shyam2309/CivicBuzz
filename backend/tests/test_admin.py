"""
CivicBuzz Tenders, Locations, Chatbot & Admin API Tests
"""

import pytest


@pytest.mark.asyncio
async def test_locations_and_wards(client):
    # 1. Resolve coordinates
    res = await client.get("/api/v1/locations/resolve?lat=20.2961&lng=85.8245")
    assert res.status_code == 200
    data = res.json()["data"]
    assert "Ward" in data["ward_name"]
    assert data["city"] == "Bhubaneswar"

    # 2. List all wards
    wards_res = await client.get("/api/v1/locations/wards")
    assert wards_res.status_code == 200
    assert len(wards_res.json()["data"]) >= 15


@pytest.mark.asyncio
async def test_tenders_portal(client):
    # List open tenders
    tenders_res = await client.get("/api/v1/tenders")
    assert tenders_res.status_code == 200
    tenders = tenders_res.json()["data"]
    assert len(tenders) >= 4

    # Tender detail
    tid = tenders[0]["tender_id"]
    detail_res = await client.get(f"/api/v1/tenders/{tid}")
    assert detail_res.status_code == 200
    assert detail_res.json()["data"]["tender_id"] == tid


@pytest.mark.asyncio
async def test_chatbot_interaction(client):
    chat_res = await client.post("/api/v1/chat/message", json={
        "message": "How do I report a pothole on Janpath road?",
        "language": "en",
    })
    assert chat_res.status_code == 200
    chat_data = chat_res.json()["data"]
    assert len(chat_data["reply"]) > 10
    assert chat_data["session_id"] is not None


@pytest.mark.asyncio
async def test_admin_dashboard_metrics(client):
    # Login admin
    adm_login = await client.post("/api/v1/auth/login", json={
        "email": "admin@civicbuzz.in",
        "password": "Admin@123",
        "role": "admin",
    })
    adm_token = adm_login.json()["data"]["access_token"]

    stats_res = await client.get("/api/v1/admin/dashboard", headers={"Authorization": f"Bearer {adm_token}"})
    assert stats_res.status_code == 200
    stats = stats_res.json()["data"]
    assert stats["total_reported"] > 0
    assert stats["total_resolved"] > 0

    # Test audit logs endpoint
    logs_res = await client.get("/api/v1/admin/audit-logs", headers={"Authorization": f"Bearer {adm_token}"})
    assert logs_res.status_code == 200
    assert isinstance(logs_res.json()["data"], list)


@pytest.mark.asyncio
async def test_department_management_and_database_persistence(client):
    # 1. Create a new department
    dept_res = await client.post("/api/v1/admin/departments", json={
        "name": "Traffic Signal & Safety",
        "description": "Manages electronic traffic signals, cameras, and road safety signage.",
        "contact_email": "traffic@civicbuzz.gov",
        "contact_phone": "+91 80 2297 5099",
        "sla_hours": 36,
    })
    assert dept_res.status_code == 201
    dept_data = dept_res.json()["data"]
    assert "TRAFFIC" in dept_data["code"]
    assert dept_data["name"] == "Traffic Signal & Safety"

    # 2. List departments from DB
    list_res = await client.get("/api/v1/admin/departments")
    assert list_res.status_code == 200
    depts = list_res.json()["data"]
    assert any(d["name"] == "Traffic Signal & Safety" for d in depts)


@pytest.mark.asyncio
async def test_complaint_admin_action_persistence(client):
    # 1. Submit a complaint as citizen
    comp_res = await client.post("/api/v1/complaints", json={
        "title": "Broken traffic light at Kalinga square",
        "description": "Signal constantly on red造成 congestion at main crossroad.",
        "category": "STREETLIGHTS",
        "latitude": 20.2961,
        "longitude": 85.8245,
        "is_anonymous": False,
    })
    assert comp_res.status_code == 201
    cid = comp_res.json()["data"]["complaint_id"]

    # 2. Admin performs triage action: ASSIGN
    assign_res = await client.post(f"/api/v1/admin/complaints/{cid}/action?action=ASSIGN&department_code=ROADS_AND_POTHOLES&notes=Priority+action")
    assert assign_res.status_code == 200
    assert assign_res.json()["data"]["status"] == "ASSIGNED"

    # 3. Verify public feed sees updated status
    pub_res = await client.get(f"/api/v1/public/complaints/{cid}")
    assert pub_res.status_code == 200
    assert pub_res.json()["data"]["status"] == "ASSIGNED"
