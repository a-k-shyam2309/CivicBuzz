# CivicBuzz — Evidence-Grounded Civic Grievance Triage & Participatory Budgeting

CivicBuzz is an evidence-grounded civic grievance triage and participatory budgeting platform designed for Indian Smart Cities and Municipal Corporations (such as BMC).

Citizens report civic problems using text, photo evidence, voice architecture, and GPS/map pin coordinates. Gemini AI triages grievances, identifies duplicates, calculates dynamic urgency scores, and routes complaints to municipal departments.

**Critical Civic Rule:** Department officers cannot directly mark a complaint as `RESOLVED`. Officers can only submit before/after evidence to mark work completed (`READY_FOR_CITIZEN_VERIFICATION`). The complainant physically inspects the ground repair to confirm resolution (with a 1–5 star rating) or dispute/reject to reopen the ticket for rework and escalation.

---

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│              CIVICBUZZ MULTI-PAGE PORTAL                   │
│  HTML5 + Vanilla CSS3 Glassmorphism + Vanilla JS + Leaflet │
│  Auth Gateway | Citizen Portal | Admin Municipal Suite     │
└─────────────────────────────┬──────────────────────────────┘
                              │ REST (JWT Bearer) / Local Sync
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  FASTAPI ASYNC BACKEND                     │
│  Auth | Complaints | Evidence | Locations | Chat | Projects│
│  Votes | Budgets | Tenders | Public | Admin | Department   │
└──────────────┬──────────────────────────────┬──────────────┘
               │                              │
               ▼                              ▼
  ┌─────────────────────────┐    ┌───────────────────────────┐
  │   PostgreSQL + PostGIS  │    │      MongoDB Atlas        │
  │   (SQLite Fallback)     │    │  (Async Motor Fallback)   │
  │   Users, Roles, Wards   │    │  Complaints & Evidence    │
  │   Projects & Votes      │    │  AI Triage & Clusters     │
  │   Municipal Tenders     │    │  Timeline & Resolutions   │
  └─────────────────────────┘    └───────────────────────────┘
```

---

## Key Features

1. **Evidence-Grounded Reporting**:
   - Photo upload with SHA-256 integrity verification hash.
   - Voice grievance note recording (multilingual speech-to-text).
   - GPS Current Location + Interactive Map Pinning with automatic reverse geocoding to Bhubaneswar Wards (e.g. Ward 12 Janpath, Ward 30 Saheed Nagar, Ward 5 Patia).
   - Gemini AI automated grievance triage (severity, category, SLA estimation, and department routing).

2. **Citizen-Verified Resolution Lifecycle**:
   - Department officers can only move tickets to `READY_FOR_CITIZEN_VERIFICATION` with before/after photos and work description.
   - The citizen complainant receives a notification and holds the sole authority to approve (`RESOLVED` with 1–5 stars and QR code generation) or dispute (`RESOLUTION_REJECTED` and escalation).

3. **Public Transparency & Issue Clusters**:
   - Public feed with privacy safeguards (complainant identities sanitized).
   - Duplicate clustering aggregating multiple reports for the same localized problem with one-click "Upvote & Merge".

4. **Participatory Budgeting & Democratic Voting**:
   - Community proposals with estimated vs allocated budget meters.
   - Live citizen voting strictly enforcing 1 vote per verified citizen.
   - Community rankings and project prioritization.

5. **Government Tenders & Procurement**:
   - 5-stage procurement lifecycle (Publication -> Technical Evaluation -> Financial Bids -> Work Order -> Execution).
   - Direct link between community grievances and municipal tenders.

6. **Gemini AI Civic Assistant Chatbot & Live Triage**:
   - Multilingual citizen assistant for complaint reporting guidance, tracking status queries, and budget explanations.

---

## Quickstart Guide

### 1. Run Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
API Documentation available at `http://localhost:8000/docs`.

### 2. Run Frontend Portal
Open `Frontend/Login_Frontend/index.html` directly in your browser or run with any static server:
- **Option A (Direct):** Double-click `Frontend/Login_Frontend/index.html` or open in any browser.
- **Option B (VS Code Live Server):** Right click `Frontend/Login_Frontend/index.html` and select **"Open with Live Server"** (at `http://127.0.0.1:5500`).
- **Option C (Python HTTP Server):**
  ```bash
  cd Frontend/Login_Frontend
  python -m http.server 3000
  ```
  Access at `http://localhost:3000`.

### 3. Fast Demo Roles (Hackathon Evaluation)
Use the 1-click role switcher in the top navigation or Sign In page:
- **Citizen Demo**: `citizen@civicbuzz.in` (Password: `Citizen@123`)
- **Department Officer Demo**: `officer@civicbuzz.in` (Password: `Officer@123`)
- **Municipal Admin Demo**: `admin@civicbuzz.in` (Password: `Admin@123`)
- **Mock OTP**: `123456`
- **Mock Aadhaar Verification**: Any 12-digit number + OTP `123456`

---

## Automated Testing

```bash
cd backend
PYTHONPATH=. pytest -v
```
All 12 backend test suites cover authentication, protected routes, complaint creation, AI triage, citizen verification, duplicate voting prevention, and department resolution safety.
