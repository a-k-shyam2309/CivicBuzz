"""
CivicBuzz Initial Database Seeder
Seeds initial Municipalities, Wards, Departments, Admin/Citizen accounts,
Participatory Projects, Tenders, and initial Complaints to match the frontend demo.
"""

import logging
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import get_password_hash
from app.models.sql.user import User, UserRole
from app.models.sql.ward import Municipality, Ward
from app.models.sql.department import Department
from app.models.sql.project import Project, ProjectStatus, WardBudget, Tender, TenderStatus

logger = logging.getLogger("civicbuzz.db.seed")


async def seed_database(db: AsyncSession, mongo_db: AsyncIOMotorDatabase):
    """Seed initial data if tables/collections are empty."""
    # 1. Seed Municipality
    stmt_muni = select(Municipality)
    res_muni = await db.execute(stmt_muni)
    muni = res_muni.scalar_one_or_none()
    if not muni:
        muni = Municipality(
            name="Bhubaneswar Municipal Corporation",
            state="Odisha",
            city="Bhubaneswar",
            code="BMC-01",
        )
        db.add(muni)
        await db.flush()

    # 2. Seed Wards
    stmt_wards = select(Ward)
    res_wards = await db.execute(stmt_wards)
    existing_wards = res_wards.scalars().all()
    if not existing_wards:
        ward_data = [
            (1, "Ward 1 - Chandrasekharpur", 20.3241, 85.8152),
            (2, "Ward 2 - Patia Corridor", 20.3548, 85.8184),
            (3, "Ward 3 - Nayapalli", 20.2985, 85.8122),
            (4, "Ward 4 - Jayadev Vihar", 20.3012, 85.8234),
            (5, "Ward 5 - Riverside Park / Mancheswar", 20.3155, 85.8521),
            (6, "Ward 6 - Rasulgarh", 20.2912, 85.8641),
            (7, "Ward 7 - Saheed Nagar", 20.2891, 85.8432),
            (8, "Ward 8 - Market Corridor", 20.2741, 85.8362),
            (9, "Ward 9 - Unit 9 / Bapuji Nagar", 20.2684, 85.8315),
            (10, "Ward 10 - Ashok Nagar", 20.2621, 85.8412),
            (11, "Ward 11 - Old Town Heritage", 20.2412, 85.8341),
            (12, "Ward 12 - Janpath / College Gate", 20.2961, 85.8245),
            (13, "Ward 13 - Khandagiri", 20.2584, 85.7865),
            (14, "Ward 14 - Baramunda", 20.2792, 85.7981),
            (15, "Ward 15 - Infocity Road", 20.3491, 85.8082),
        ]
        for wnum, wname, lat, lng in ward_data:
            db.add(Ward(
                ward_number=wnum,
                ward_name=wname,
                municipality_id=muni.id,
                center_lat=lat,
                center_lng=lng,
                radius_meters=2500.0,
            ))
        await db.flush()

    # 3. Seed Departments
    stmt_dept = select(Department)
    res_dept = await db.execute(stmt_dept)
    if not res_dept.scalars().all():
        departments = [
            ("ROADS_AND_POTHOLES", "Roads & Potholes Department", "Maintains city roads, asphalt, potholes, footpaths", 24),
            ("GARBAGE_AND_SANITATION", "Garbage & Sanitation Department", "Handles waste collection, dumping sites, bins", 12),
            ("WATER_AND_DRAINAGE", "Water & Drainage Department", "Addresses pipe bursts, waterlogging, drain blockage", 24),
            ("STREET_LIGHTS_AND_ELECTRICITY", "Street Lighting & Electricity Department", "Repairs streetlights, fixtures, wiring", 24),
            ("PARKS_AND_PUBLIC_SPACES", "Parks & Public Spaces Department", "Maintains public parks, benches, playgrounds", 72),
            ("HEALTH_AND_STRAY_ANIMALS", "Public Health & Veterinary Department", "Sanitation vector control, stray animal management", 48),
        ]
        for code, name, desc, sla in departments:
            db.add(Department(code=code, name=name, description=desc, sla_hours=sla))
        await db.flush()

    # 4. Seed Admin and Citizen Users
    stmt_user = select(User).where(User.email == "admin@civicbuzz.in")
    res_user = await db.execute(stmt_user)
    if not res_user.scalar_one_or_none():
        admin_user = User(
            user_uid="USR-ADMIN-01",
            email="admin@civicbuzz.in",
            full_name="Aditya Kumar Shyam",
            hashed_password=get_password_hash("Admin@123"),
            role=UserRole.SUPER_ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)

    stmt_cit = select(User).where(User.email == "citizen@civicbuzz.in")
    res_cit = await db.execute(stmt_cit)
    if not res_cit.scalar_one_or_none():
        citizen_user = User(
            user_uid="USR-CITIZEN-01",
            email="citizen@civicbuzz.in",
            full_name="Aanya Sharma",
            hashed_password=get_password_hash("Citizen@123"),
            role=UserRole.CITIZEN,
            aadhaar_masked="XXXX-XXXX-8921",
            is_aadhaar_verified=True,
            is_active=True,
            is_verified=True,
        )
        db.add(citizen_user)
    await db.flush()

    # 5. Seed Participatory Budgeting Projects
    stmt_proj = select(Project)
    res_proj = await db.execute(stmt_proj)
    if not res_proj.scalars().all():
        projects = [
            ("Drainage improvement on School Road", "Clear blocked drains and build two covered storm segments near the primary school.", 12, "Drainage", 400000.0, 49, "💧", "School Road, Ward 12"),
            ("Install 20 LED streetlights", "Add energy-efficient LED streetlights around the market and school corridors for safety.", 8, "Lighting", 300000.0, 33, "💡", "Market Corridor, Ward 8"),
            ("Priority road patching", "Repair heavily damaged pothole segments across Ward 15 connecting to Infocity.", 15, "Roads", 250000.0, 21, "🛣️", "Infocity Road, Ward 15"),
        ]
        for idx, (title, desc, wid, cat, cost, votes, icon, loc) in enumerate(projects, start=1):
            db.add(Project(
                project_uid=f"PRJ-00{idx}",
                title=title,
                description=desc,
                ward_id=wid,
                category=cat,
                estimated_cost=cost,
                allocated_budget=cost,
                vote_count=votes,
                status=ProjectStatus.APPROVED,
                icon=icon,
                location_name=loc,
                linked_complaint_count=votes // 4,
            ))
        await db.flush()

    # 6. Seed Government Tenders
    stmt_tenders = select(Tender)
    res_tenders = await db.execute(stmt_tenders)
    if not res_tenders.scalars().all():
        tenders = [
            ("CB-T-0015", "Priority road patching — Ward 15", "Repair the most-reported pothole locations across Ward 15.", 15, "Roads & Potholes", "roads", "Ward 15", 250000.0, 30, 3, 21, TenderStatus.PUBLISHED, 2, 40),
            ("CB-T-0018", "Drainage improvement — School Road", "Clear blocked drains and improve two drainage segments near primary school.", 12, "Water & Drainage", "drainage", "Ward 12", 400000.0, 45, 4, 49, TenderStatus.PUBLISHED, 1, 20),
            ("CB-T-0012", "Install 20 LED streetlights", "Add or replace streetlights around the market and school corridors.", 8, "Street Lights", "lighting", "Ward 8", 300000.0, 30, 2, 33, TenderStatus.IN_PROGRESS, 3, 72),
            ("CB-T-0009", "Market sanitation upgrade", "Improve waste collection points and sanitation facilities near the market.", 9, "Garbage & Sanitation", "sanitation", "Ward 9", 180000.0, 20, 5, 18, TenderStatus.COMPLETED, 5, 100),
        ]
        for tid, title, desc, wid, dept, cat, loc, budget, dur, locs, votes, status, stage, prog in tenders:
            db.add(Tender(
                tender_id=tid,
                title=title,
                description=desc,
                ward_id=wid,
                department_name=dept,
                category=cat,
                location=loc,
                estimated_budget=budget,
                duration_days=dur,
                verified_locations_count=locs,
                community_votes=votes,
                status=status,
                stage_progress=stage,
                progress_percentage=prog,
            ))
        await db.flush()

    await db.commit()

    # 7. Seed Initial Complaints in MongoDB
    complaint_count = await mongo_db.complaints.count_documents({})
    if complaint_count == 0:
        now_str = datetime.now(timezone.utc).isoformat()
        demo_complaints = [
            {
                "complaint_id": "CB-0142",
                "user_id": 2,
                "complainant_name": "Aanya Sharma",
                "complainant_email": "citizen@civicbuzz.in",
                "is_anonymous": False,
                "title": "Large pothole near college gate",
                "description": "Large pothole near the college gate, causing traffic to swerve into the oncoming lane.",
                "category": "ROAD",
                "sub_category": "POTHOLE",
                "location": {
                    "latitude": 20.2961,
                    "longitude": 85.8245,
                    "address": "Janpath Road, Saheed Nagar, Ward 12",
                    "city": "Bhubaneswar",
                    "municipality": "Bhubaneswar Municipal Corporation",
                    "ward_id": 12,
                    "ward_name": "Ward 12",
                    "source": "CURRENT_LOCATION",
                    "location_confidence": 0.96,
                },
                "location_point": {"type": "Point", "coordinates": [85.8245, 20.2961]},
                "status": "IN_PROGRESS",
                "department_code": "ROADS_AND_POTHOLES",
                "department_name": "Roads & Potholes Department",
                "severity": "HIGH",
                "priority": {"score": 85.0, "level": "HIGH", "reasons": ["High traffic hazard near educational institution", "5 duplicate citizen reports"]},
                "ai_analysis": {"category": "ROAD", "sub_category": "POTHOLE", "severity": "HIGH", "summary": "Large pothole causing vehicle hazard on Janpath Road", "recommended_department": "ROADS_AND_POTHOLES", "confidence": 0.94, "safety_risk_identified": True},
                "duplicate_info": {"is_duplicate": True, "duplicate_score": 0.88, "cluster_count": 5, "related_complaint_ids": ["CB-0143", "CB-0144"]},
                "evidence": [],
                "timeline": [
                    {"step": "Reported", "status": "SUBMITTED", "timestamp": now_str, "actor_role": "CITIZEN", "notes": "Reported with photo evidence."},
                    {"step": "Acknowledged", "status": "ASSIGNED", "timestamp": now_str, "actor_role": "AI_SYSTEM", "notes": "Routed to Roads & Potholes Dept."},
                    {"step": "In Progress", "status": "IN_PROGRESS", "timestamp": now_str, "actor_role": "OFFICER", "notes": "Repair crew dispatched."},
                ],
                "citizen_confirmed_resolved": False,
                "created_at": now_str,
                "updated_at": now_str,
            },
            {
                "complaint_id": "CB-0139",
                "user_id": 2,
                "complainant_name": "Aanya Sharma",
                "complainant_email": "citizen@civicbuzz.in",
                "is_anonymous": True,
                "title": "Broken pipe flooding sidewalk",
                "description": "Clean drinking water pipe broken and overflowing on the public sidewalk for 2 days.",
                "category": "WATER",
                "sub_category": "BROKEN_PIPE",
                "location": {
                    "latitude": 20.2985,
                    "longitude": 85.8122,
                    "address": "Nayapalli Road, Ward 3",
                    "city": "Bhubaneswar",
                    "municipality": "Bhubaneswar Municipal Corporation",
                    "ward_id": 3,
                    "ward_name": "Ward 3",
                    "source": "MAP_PIN",
                    "location_confidence": 0.92,
                },
                "location_point": {"type": "Point", "coordinates": [85.8122, 20.2985]},
                "status": "SUBMITTED",
                "department_code": "WATER_AND_DRAINAGE",
                "department_name": "Water & Drainage Department",
                "severity": "HIGH",
                "priority": {"score": 75.0, "level": "HIGH", "reasons": ["Clean water loss and pedestrian obstruction"]},
                "ai_analysis": {"category": "WATER", "sub_category": "BROKEN_PIPE", "severity": "HIGH", "summary": "Pipe burst flooding sidewalk", "recommended_department": "WATER_AND_DRAINAGE", "confidence": 0.91, "safety_risk_identified": True},
                "duplicate_info": {"is_duplicate": False, "duplicate_score": 0.0, "cluster_count": 1, "related_complaint_ids": []},
                "evidence": [],
                "timeline": [{"step": "Reported", "status": "SUBMITTED", "timestamp": now_str, "actor_role": "CITIZEN", "notes": "Reported by citizen."}],
                "citizen_confirmed_resolved": False,
                "created_at": now_str,
                "updated_at": now_str,
            },
            {
                "complaint_id": "CB-0131",
                "user_id": 2,
                "complainant_name": "Aanya Sharma",
                "complainant_email": "citizen@civicbuzz.in",
                "is_anonymous": True,
                "title": "Overflowing bin at market corner",
                "description": "Garbage container full and spilling onto the street corner.",
                "category": "SANITATION",
                "sub_category": "OVERFLOWING_BIN",
                "location": {
                    "latitude": 20.2891,
                    "longitude": 85.8432,
                    "address": "Saheed Nagar Market, Ward 7",
                    "city": "Bhubaneswar",
                    "municipality": "Bhubaneswar Municipal Corporation",
                    "ward_id": 7,
                    "ward_name": "Ward 7",
                    "source": "CURRENT_LOCATION",
                    "location_confidence": 0.95,
                },
                "location_point": {"type": "Point", "coordinates": [85.8432, 20.2891]},
                "status": "ASSIGNED",
                "department_code": "GARBAGE_AND_SANITATION",
                "department_name": "Garbage & Sanitation Department",
                "severity": "MEDIUM",
                "priority": {"score": 52.0, "level": "MEDIUM", "reasons": ["Commercial area sanitation"]},
                "ai_analysis": {"category": "SANITATION", "sub_category": "OVERFLOWING_BIN", "severity": "MEDIUM", "summary": "Overflowing garbage bin", "recommended_department": "GARBAGE_AND_SANITATION", "confidence": 0.90, "safety_risk_identified": False},
                "duplicate_info": {"is_duplicate": False, "duplicate_score": 0.0, "cluster_count": 1, "related_complaint_ids": []},
                "evidence": [],
                "timeline": [
                    {"step": "Reported", "status": "SUBMITTED", "timestamp": now_str, "actor_role": "CITIZEN", "notes": "Reported by citizen."},
                    {"step": "Acknowledged", "status": "ASSIGNED", "timestamp": now_str, "actor_role": "AI_SYSTEM", "notes": "Routed to Sanitation Department."},
                ],
                "citizen_confirmed_resolved": False,
                "created_at": now_str,
                "updated_at": now_str,
            },
        ]
        for comp in demo_complaints:
            await mongo_db.complaints.insert_one(comp)

    logger.info("Database seeding completed successfully.")
