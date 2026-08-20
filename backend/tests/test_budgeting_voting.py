"""
CivicBuzz Participatory Budgeting & Voting Tests
"""

import pytest


@pytest.mark.asyncio
async def test_project_listing_and_voting_uniqueness(client):
    # 1. Fetch participatory projects
    list_resp = await client.get("/api/v1/projects")
    assert list_resp.status_code == 200
    projects = list_resp.json()["data"]
    assert len(projects) >= 3

    first_proj_id = projects[0]["id"]
    initial_votes = projects[0]["vote_count"]

    # 2. Vote for first project (citizen user)
    cit_login = await client.post("/api/v1/auth/login", json={
        "email": "citizen@civicbuzz.in",
        "password": "Citizen@123",
    })
    token = cit_login.json()["data"]["access_token"]

    vote_resp = await client.post(
        f"/api/v1/projects/{first_proj_id}/vote",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert vote_resp.status_code == 200
    assert vote_resp.json()["data"]["total_votes"] == initial_votes + 1

    # 3. Duplicate vote attempt should be blocked
    dup_vote_resp = await client.post(
        f"/api/v1/projects/{first_proj_id}/vote",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert dup_vote_resp.status_code == 409  # Conflict / Duplicate


@pytest.mark.asyncio
async def test_project_rankings(client):
    rankings_resp = await client.get("/api/v1/projects/rankings")
    assert rankings_resp.status_code == 200
    rankings = rankings_resp.json()["data"]
    assert len(rankings) >= 1
    assert rankings[0]["rank"] == 1
