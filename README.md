# 🏛️ CivicBuzz — Evidence-Grounded Civic Grievance Triage & Participatory Budgeting

[![IDEATHON 2026](https://img.shields.io/badge/IDEATHON_2026-Problem_Statement_S--36-FF6F00?style=for-the-badge&logo=rocket&logoColor=white)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash_2.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![PostgreSQL](https://img.shields.io/badge/PostGIS-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)

> **IDEATHON 2026** (College Hackathon) | **Problem Statement ID:** `S-36`  
> **Problem Statement Title:** Evidence-Grounded Civic Grievance Triage and Participatory Budgeting Platform  
> **Theme:** Miscellaneous | **PS Category:** Software | **Team Name:** CivicBuzz

---

## 📌 Executive Summary & Problem Statement

Urban civic grievance management across Indian municipalities faces acute operational failures that directly compromise citizen safety, waste public funds, and erode institutional trust:
- **Fatal Infrastructure Hazards:** Over **9,438 reported deaths** are directly caused by potholes and faulty road infrastructure across India. Faults in public infrastructure claim more lives annually than many critical security threats.
- **Mounting Grievance Backlog:** In 2025 alone, municipal jurisdictions like Odisha entered the year burdened with over **18,363 unresolved civic cases**.
- **Systemic Fiscal Disconnect:** Despite over **₹65,000 Crore** allocated to urban road repairs, citizen accident rates continue an upward incline—demanding systemic governance reform rather than isolated patch jobs.
- **Public Health & Environmental Toll:** Uncollected municipal garbage leads to animal casualties, toxic runoff, pervasive stench, and degraded urban hygiene.
- **Opaque "Blame Game" Redressal:** In traditional portals, authorities unilaterally mark tickets as "Resolved" without verified physical inspection, locking citizens out of the validation process.
- **Duplicate Complaint Inundation:** Identical complaints regarding the same localized issue pile up as unlinked tickets without AI triage, urgency ranking, or duplicate detection.
- **Unwarned Commuter Danger:** Commuters lack real-time warnings about hazardous road breaks along their routes, putting daily lives at risk.

**CivicBuzz** is an evidence-grounded civic grievance triage, fraud gatekeeping, citizen-verified resolution, and participatory budgeting platform designed for Indian Smart Cities and Urban Local Bodies (ULBs).

---

## 💡 Why CivicBuzz? (The Paradigm Shift)

```text
       Traditional Grievance Portals                       CivicBuzz Evidence-Grounded Platform
 ┌───────────────────────────────────────────────┐   ┌───────────────────────────────────────────────┐
 │ • Manual sorting & frequent misrouting        │   │ • Multimodal Gemini AI triage & ward routing  │
 │ • Authority unilaterally marks ticket "Done"  │   │ • ONLY citizen complainant can close tickets  │
 │ • Duplicate complaints clog officer queues    │   │ • Multi-signal clustering + Upvote & Merge    │
 │ • Static forms with zero road safety feedback │   │ • Live Commuter Hazard Map saving lives       │
 │ • Opaque budget allocation & closed tenders   │   │ • Participatory budgeting & tender visibility │
 └───────────────────────────────────────────────┘   └───────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture & Data Flow

```text
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              CITIZEN & ADMIN MULTI-PAGE PORTAL                         │
 │        HTML5 • Glassmorphism CSS3 • Vanilla JS • Leaflet Map Engine • Web Audio        │
 └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                             │ REST API (JSON / Bearer JWT)
                                             ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                               FASTAPI ASYNC BACKEND CORE                               │
 │   Auth Engine  •  Grievance Router  •  Cluster Engine  •  Budgeting & Tender Engine    │
 └───────────┬───────────────────────────────┬────────────────────────────┬───────────────┘
             │                               │                            │
             ▼                               ▼                            ▼
 ┌───────────────────────┐       ┌───────────────────────┐    ┌───────────────────────┐
 │   GEMINI AI ENGINE    │       │  POSTGRESQL + POSTGIS │    │     MONGODB ATLAS     │
 │ • Visual Verification │       │ • Ward Boundaries GIS │    │ • Complaint Tickets   │
 │ • Severity & SLA Rank │       │ • Spatial Coordinates │    │ • Evidence Trails     │
 │ • Semantic NLP Triage │       │ • Tenders & Proposals │    │ • Immutable Audit Log │
 └───────────────────────┘       └───────────────────────┘    └───────────────────────┘
             │                                                            │
             ▼                                                            ▼
 ┌───────────────────────────────────────┐                    ┌───────────────────────┐
 │       CLOUDINARY / AWS S3 MEDIA       │                    │  QR VERIFICATION LOG  │
 │  SHA-256 Hashed Evidence Images/Audio │                    │ Scannable Proof Trail │
 └───────────────────────────────────────┘                    └───────────────────────┘
```

### End-to-End Processing Methodology
1. **Citizen Lodge:** Citizen captures geo-tagged photo/voice/text. A cryptographic SHA-256 hash is computed for evidence integrity.
2. **AI Gatekeeper & Triage:** Gemini AI validates image authenticity (filtering non-civic media/stock photos), classifies domain (Roads, Sanitation, Electrical, Water), and estimates SLA.
3. **Spatial Ward Routing:** PostGIS performs reverse geospatial polygon queries to accurately assign the ticket to the exact municipal ward and responsible officer.
4. **Duplicate Clustering:** Multi-signal algorithms aggregate duplicate complaints into an active localized incident cluster.
5. **Two-Phase Citizen Closure:** Department officers remediate the issue and upload proof (`READY_FOR_CITIZEN_VERIFICATION`). The complainant physically inspects the ground repair, rates 1–5 stars, and approves (`RESOLVED`) or rejects (`RESOLUTION_REJECTED`) for escalation.

---

## 🌟 Core System Modules & Features

### 1. Evidence-Grounded Multi-Modal Reporting
- **Triple-Modal Lodging:** Report issues via structured text descriptions, geolocated photo uploads, or speech-to-text voice recordings in regional languages.
- **SHA-256 Integrity Verification:** Every uploaded photo/audio file receives an immutable cryptographic hash to guarantee tamper-proof evidence trails.
- **Interactive Geospatial Pinning:** High-precision Leaflet map picker with auto reverse-geocoding into municipal ward polygons (e.g., Ward 12 Janpath, Ward 30 Saheed Nagar, Ward 5 Patia).

### 2. Gemini AI Triage & Fraud Gatekeeper
- **Visual Authenticity Guard:** Automatically screens submitted media to filter out non-civic photos, downloaded memes, or stock pictures before reaching department queues.
- **Dynamic Severity & SLA Scoring:** Analyzes hazard severity (e.g., exposed high-voltage cables vs minor litter) to assign dynamic 0–100 priority scores and SLA resolution targets.

### 3. Citizen-Verified Ground Resolution Lifecycle
- **Strict Anti-Corruption Rule:** Municipal authorities *cannot* unilaterally mark a complaint as resolved.
- **Before/After Evidence:** Remediating officers must submit time-stamped photographic proof of completed work.
- **Citizen Final Authority:** Only the original complainant holds the authority to approve ticket closure or dispute incomplete repairs for administrative escalation.
- **Public Scannable QR Codes:** Every resolved ticket generates a tamper-proof QR code detailing complaint history and verification timestamps.

### 4. Multi-Signal Duplicate Clustering Engine
- **Intelligent Backlog Merging:** Computes Geodesic Proximity (35%), Semantic NLP Similarity (30%), Category Matching (15%), Time Proximity (10%), and Image Similarity (10%).
- **One-Click Upvoting:** Commuters upvote existing cluster issues instead of submitting redundant tickets, raising urgency without cluttering administrative queues.

### 5. Commuter Hazard Map & Real-Time Alerts
- **Interactive Live Heatmap:** Visualizes open road breaks, active potholes, and urban hazards across city wards.
- **Proactive Safety:** Informs daily commuters and transport logistics of dangerous road segments to prevent fatal accidents.

### 6. Participatory Budgeting & Democratic Voting
- **Citizen Proposals:** Verified citizens propose localized infrastructure initiatives (e.g., drainage overhauls, solar streetlighting).
- **One-Citizen-One-Vote:** Democratic voting mechanism enforcing strictly 1 vote per citizen to prioritize community projects.
- **Budget Allocation Meters:** Transparent visualization comparing estimated project costs against municipal budget approvals.

### 7. Municipal Tender Transparency & Procurement
- **5-Stage Tender Tracking:** Public monitoring of procurement stages (Publication ➔ Technical Evaluation ➔ Financial Bids ➔ Work Order ➔ Execution).
- **Grievance-to-Tender Linkage:** Connects persistent high-urgency complaint clusters directly to municipal repair contracts.

### 8. 24/7 Multilingual Gemini Civic Assistant
- **Conversational Guidance:** Citizen chatbot assisting users in drafting complaints, checking live ticket status, and understanding municipal schemes.

---

## 🎯 Impact & Stakeholder Transformation

```text
 ┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
 │ CITIZENS:                │ AUTHORITIES:             │ CONTRACTORS:             │
 │ From Ignored ➔ Empowered │ From Overwhelmed ➔ Smart │ From Opaque ➔ Fair       │
 ├──────────────────────────┼──────────────────────────┼──────────────────────────┤
 │ • Safety First navigation│ • Zero backlog clutter   │ • Open tender portal     │
 │ • Voice regional support │ • Auto-routed desk tasks │ • Transparent execution  │
 │ • Citizen-only closure   │ • AI Budget Advisor      │ • Objective SLA audit    │
 └──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

- **Social Impact:** Restores democratic trust and protects pedestrian and vehicular lives through live route alerts.
- **Economic Impact:** Eliminates municipal fund wastage by channeling budgets toward verified citizen-prioritized repairs.
- **Environmental Impact:** Speeds up sanitation, toxic waste cleanup, and waterlogging redressal across urban wards.

---

## 📊 Comparative Analysis: CivicBuzz vs Existing Solutions

| Evaluation Dimension | Traditional Portals (CPGRAMS / 311) | FixMyStreet / SeeClickFix | CivicBuzz Platform |
|---|---|---|---|
| **Issue Triage** | Manual sorting; frequent department misrouting | Basic rule-based routing | **Multimodal Gemini AI auto-routing & SLA prediction** |
| **Fake Evidence Prevention** | None; manual officer verification | User reporting | **AI Image Integrity Gatekeeper (SHA-256 + Visual Scan)** |
| **Ticket Closure Authority** | Department officer unilaterally | Mixed / Officer-driven | **Exclusively Citizen Complainant (With Dispute Rework)** |
| **Duplicate Prevention** | None; tickets pile up individually | Basic radius matching | **Multi-Signal Semantic & Geodesic Clustering + Upvoting** |
| **Commuter Safety** | Reactive; no live public hazard map | Public listing only | **Real-Time Navigational Hazard Map for Commuters** |
| **Fiscal Governance** | Opaque municipal budgets | Not supported | **Participatory Budgeting & Public Tender Tracking** |

---

## 🛠️ Technology Stack

```text
Layer                   Technology & Tools
────────────────────────────────────────────────────────────────────────────────────────
Frontend UI / UX        HTML5, Vanilla CSS3 (Glassmorphic Design), Vanilla JavaScript ES6+
Mapping & GIS           Leaflet.js, OpenStreetMap, GeoJSON Spatial Boundary Layers
Backend REST API        FastAPI (Async Python 3.12), Uvicorn ASGI Server
Artificial Intelligence Google Gemini 2.5 / Flash (Multimodal Vision & NLP Triage)
Spatial Database        PostgreSQL + PostGIS (Zonal Wards, Tenders, Spatial Coordinates)
Document Database       MongoDB Atlas (Complaints, Audit Logs, AI Predictions, Timeline)
Security & Auth         JWT Bearer Tokens, Argon2 Password Hashing, Role-Based Access Control
Media Storage           Cloudinary / AWS S3 with SHA-256 Image Integrity Validation
Testing Framework       Pytest, Pytest-Asyncio, HTTPX Test Client (12/12 Test Suites Passing)
────────────────────────────────────────────────────────────────────────────────────────
```

---

## 📡 REST API Architecture

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/auth/register` | `POST` | Public | Register a citizen or department officer account |
| `/api/v1/auth/login` | `POST` | Public | Authenticate user & issue secure JWT access token |
| `/api/v1/complaints` | `POST` | Citizen | Lodge grievance with media, GPS coordinates & AI triage |
| `/api/v1/complaints/my/list` | `GET` | Citizen | Fetch complaints created by authenticated citizen |
| `/api/v1/complaints/nearby/search` | `GET` | Public | Spatial radius query for open civic issues |
| `/api/v1/complaints/{id}/submit-resolution`| `POST` | Officer | Department submits completion work & before/after proof |
| `/api/v1/complaints/{id}/verify-resolution`| `POST` | Citizen | Complainant verifies physical repair & gives star rating |
| `/api/v1/complaints/{id}/reject-resolution`| `POST` | Citizen | Complainant disputes poor repair and triggers escalation |
| `/api/v1/projects` | `GET` / `POST`| Citizen | View and submit participatory budgeting proposals |
| `/api/v1/projects/{id}/vote` | `POST` | Citizen | Cast verified democratic vote on community proposal |
| `/api/v1/projects/rankings` | `GET` | Public | Live ranked leaderboard of prioritized projects |
| `/api/v1/tenders` | `GET` | Public | Transparent tracking of municipal procurement tenders |
| `/api/v1/chat/message` | `POST` | Public | Interactive Multilingual Gemini AI Civic Assistant |
| `/api/v1/admin/dashboard` | `GET` | Admin | Comprehensive municipal KPIs, SLA alerts & analytics |

---

## 📁 Repository Structure

```text
CivicBuzz/
├── Frontend/                           # Multi-Portal Web Interface
│   ├── Login_Frontend/                 # Unified Portal Hub & Entry Points
│   │   ├── Admin Page Frontend/        # Municipal Admin & Department Suites
│   │   │   ├── Admin Issue Queue Frontend/ # Zonal queues & status actions
│   │   │   ├── Analytics/              # SLA compliance & resolution KPIs
│   │   │   ├── Budgeting/              # Public fund allocation & proposals
│   │   │   ├── departments/            # Department routing & officer dispatch
│   │   │   ├── Map & Hotspots/         # Live ward GIS map & hazard clusters
│   │   │   └── index.html              # Admin dashboard entry
│   │   ├── Client Page Frontend/       # Citizen Grievance & Voting Suite
│   │   │   ├── Complaint_Details_Frontend/ # Detailed tracking & star ratings
│   │   │   ├── Contact Us Frontend/    # Civic helpline & support forms
│   │   │   ├── Map_Frontend/           # Commuter hazard heatmap & route alerts
│   │   │   ├── Report_Issue_Frontend/  # Multi-modal grievance reporting form
│   │   │   ├── Tenders/                # Public municipal procurement tracker
│   │   │   ├── Track_complaints_Frontend/ # Live citizen grievance tracker
│   │   │   └── index.html              # Citizen portal entry
│   │   ├── assets/                     # Logos and design branding media
│   │   ├── index.html                  # Main Landing & Role Gateway
│   │   └── styles.css / script.js      # UI design tokens & state handlers
│   └── api-config.js                   # Centralized backend REST API client
├── backend/                            # Async FastAPI Core Services
│   ├── app/                            # Application Core (api, core, db, models, schemas, services)
│   ├── tests/                          # 12/12 Automated Pytest suites
│   ├── uploads/                        # Local evidence & QR code storage cache
│   ├── Dockerfile                      # Backend containerization image spec
│   └── requirements.txt                # Python production dependencies
├── uploads/                            # Generated QR verification codes & media
├── docker-compose.yml                  # Multi-service container orchestration
└── vercel.json                         # Static web routing & deployment config
```

---

## ⚡ Quickstart & Installation Guide

### Prerequisites
- **Python 3.12+** | **Modern Web Browser** (Chrome, Firefox, Edge)

### 1. Clone & Setup Backend
```bash
git clone https://github.com/your-username/CivicBuzz.git
cd CivicBuzz/backend
cp .env.example .env
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
> Interactive API Documentation: **Swagger UI** at `http://localhost:8000/docs` | **ReDoc** at `http://localhost:8000/redoc`

### 2. Launch Frontend Application
The frontend is built using standard web standards without heavyweight build pipelines:
- **Option A (VS Code Live Server):** Right-click `Frontend/Login_Frontend/index.html` ➔ **"Open with Live Server"** (`http://127.0.0.1:5500`).
- **Option B (Python Local Server):**
  ```bash
  cd Frontend/Login_Frontend
  python -m http.server 3000
  ```
  Open `http://localhost:3000` in your web browser.

### 3. Rapid Evaluation Demo Credentials
Use these pre-configured accounts to test role-based access during hackathon evaluation:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Citizen Complainant** | `citizen@civicbuzz.in` | `Citizen@123` | Lodge issues, vote on budgets, verify/reject resolutions |
| **Department Officer** | `officer@civicbuzz.in` | `Officer@123` | View ward queues, submit repair proof & progress |
| **Municipal Admin** | `admin@civicbuzz.in` | `Admin@123` | City analytics, SLA alerts, tender management |
| **Demo OTP** | `123456` | — | Quick simulated mobile OTP verification |

### 4. Running Test Suites
```bash
cd backend
PYTHONPATH=. pytest -v
```

---

## 🛡️ Feasibility, Challenges & Mitigation Strategies

```text
 ┌───────────────────────────────┬────────────────────────────────────────────────────────┐
 │ Identified Risk / Bottleneck  │ CivicBuzz Engineering Mitigation Strategy              │
 ├───────────────────────────────┼────────────────────────────────────────────────────────┤
 │ 1. Spam & Fake Media Uploads  │ Multimodal Gemini AI Gatekeeper screens images for     │
 │                               │ genuine civic defects before issuing a ticket number.  │
 ├───────────────────────────────┼────────────────────────────────────────────────────────┤
 │ 2. GPS Inaccuracies & Drift   │ PostGIS spatial polygon matching verifies coordinates  │
 │                               │ against official municipal ward boundary shapefiles.   │
 ├───────────────────────────────┼────────────────────────────────────────────────────────┤
 │ 3. Monsoon Reporting Spikes   │ Fully asynchronous FastAPI microservices with database │
 │                               │ connection pooling and stateless horizontal scaling.   │
 └───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability, Viability & Monetization Model

```text
                    ┌─────────────────────────────────────────────────────┐
                    │               CIVICBUZZ SUSTAINABILITY              │
                    └───────────┬─────────────────────────────┬───────────┘
                                │                             │
                                ▼                             ▼
    ┌───────────────────────────────────────┐     ┌───────────────────────────────────────┐
    │          B2G GOV-TECH SAAS            │     │         B2B HAZARD MAP API            │
    │ Tiered subscription for Municipal     │     │ Real-time road condition telemetry    │
    │ Corporations: AI Triage Engine, SLA   │     │ licensed to logistics & quick-commerce│
    │ Dashboard, and Budget Optimizer.      │     │ fleets (e.g., Swiggy, Amazon, Uber).  │
    └───────────────────────────────────────┘     └───────────────────────────────────────┘
                                │                             │
                                └──────────────┬──────────────┘
                                               ▼
                                ┌───────────────────────────────────────┐
                                │          TENDER MARKETPLACE           │
                                │ 0.5%–1.0% facilitation fee on public  │
                                │ contractor bids executed via platform.│
                                └───────────────────────────────────────┘
```

- **Stateless Cloud Microservices:** FastAPI backend and MongoDB Atlas scale seamlessly from a single municipal ward to 1,000+ urban cities.
- **Decoupled Architecture:** Heavy media storage (AWS S3/Cloudinary) decoupled from primary transactional databases for sub-50ms API responses.
- **Triple Sector Monetization:** Blends government SaaS licenses, enterprise B2B hazard telemetry APIs, and procurement marketplace transaction fees.

---

## 📚 Research Foundations & Standards

1. **IEEE Transactions on Computational Social Systems:** *"Automated Triage and Categorization of Citizen Grievances Using NLP"* — Foundation for semantic intent extraction and automated departmental routing.
2. **CPGRAMS (Centralised Public Grievance Redress and Monitoring System):** [cpgrams.gov.in](https://cpgrams.gov.in) — National benchmark for Indian civic grievance lifecycles and SLA compliance targets.
3. **FixMyStreet (mySociety Framework):** [fixmystreet.com](https://www.fixmystreet.com) — International gold standard for geospatial civic defect reporting and civic openness.
4. **SeeClickFix (CivicPlus Platform):** [seeclickfix.com](https://seeclickfix.com) — Industry reference for municipal boundary integrations and automated departmental dispatch.

---

## 👥 Team CivicBuzz (IDEATHON 2026)
*Empowering citizens, optimizing municipal administration, and building transparent, safer smart cities.*
