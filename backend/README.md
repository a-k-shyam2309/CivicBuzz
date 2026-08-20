# CivicBuzz Backend API 🚀

**Evidence-Grounded Civic Grievance Triage, Transparency, Issue Verification, and Participatory Budgeting Platform.**

CivicBuzz connects citizens directly to municipal governance. Powered by FastAPI, PostgreSQL + PostGIS, MongoDB Atlas, Gemini AI, and Google Maps Platform.

---

## 🏛️ Core System Architecture

```text
                       ┌─────────────────────────────┐
                       │     EXISTING CIVICBUZZ      │
                       │   HTML + CSS + JavaScript    │
                       └──────────────┬──────────────┘
                                      │ REST / JSON
                                      ▼
                       ┌─────────────────────────────┐
                       │        FASTAPI BACKEND       │
                       │                              │
                       │ API Gateway / Routers        │
                       └──────────────┬──────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
     Authentication            Complaint Engine             Public Services
     (JWT + RBAC +             (AI Triage + Maps +          (Tenders + Budgets +
      Aadhaar Abstraction)      Duplicates + Priority +      Projects + Voting +
                                Citizen Resolution)          Transparency)
                                      │
                     ┌────────────────┴────────────────┐
                     │                                 │
                     ▼                                 ▼
               MongoDB Atlas                  PostgreSQL + PostGIS
              (Complaints, AI triage,         (Wards, Boundaries,
               Evidence metadata, Chat,        Projects, Votes,
               Immutable audit logs)           Tenders, Budgets)
```

---

## 🌟 Key Features

1. **Citizen-Verified Resolution Workflow (Core Rule)**:
   - Government departments *cannot* independently mark civic grievances as resolved.
   - When remediation work is completed, the department uploads before/after photo evidence (`READY_FOR_CITIZEN_VERIFICATION`).
   - The verified citizen complainant physically inspects the repair on site, provides a 1–5 star rating, and clicks `Problem Resolved` to finalize closure and generate a public QR verification trail.
   - If the repair is defective, the citizen disputes the resolution (`RESOLUTION_REJECTED`), automatically reopening the grievance and escalating it for department rework.

2. **Multilingual AI Grievance Triage (Gemini 2.5/Flash)**:
   - Automatically classifies category, sub-category, severity, public safety hazards, summary, and responsible municipal department with confidence scoring.

3. **Multi-Signal Duplicate Clustering Engine**:
   - Geodesic Proximity (35%) + Semantic Text Similarity (30%) + Category Match (15%) + Time Proximity (10%) + Image Similarity (10%).

4. **Multi-Factor Priority Scoring**:
   - Dynamic prioritization (0–100) combining severity, cluster volume, active safety hazards, and unresolved aging with explainable reasoning.

5. **Aadhaar Identity Verification Abstraction**:
   - `MockAadhaarProvider` for hackathon demonstration with instant OTP generation and `XXXX-XXXX-9012` masking.
   - `UIDAISandboxProvider` interface ready for authorized UIDAI production keys without leaking raw Aadhaar numbers.

6. **Participatory Budgeting & Community Voting**:
   - Citizens propose and vote on community civic projects (drainage, streetlights, road patching).
   - Strict one-vote-per-citizen enforcement and real-time community rankings.

---

## 🛠️ Quickstart & Local Setup

### 1. Requirements
- Python 3.12+
- `pip`

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Tests
```bash
PYTHONPATH=backend pytest backend/tests -v
```

### 5. Launch the Server
```bash
PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc API Documentation: `http://localhost:8000/redoc`

---

## 📡 REST API Summary

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/auth/register` | `POST` | Public | Register new citizen or official account |
| `/api/v1/auth/login` | `POST` | Public | Authenticate with email and password |
| `/api/v1/auth/aadhaar/initiate` | `POST` | Citizen | Initiate Aadhaar OTP verification |
| `/api/v1/auth/aadhaar/verify` | `POST` | Citizen | Verify Aadhaar OTP (Mock/Production) |
| `/api/v1/complaints` | `POST` | Citizen | Submit civic complaint with AI triage & coordinates |
| `/api/v1/complaints/my/list` | `GET` | Citizen | View authenticated citizen's complaints |
| `/api/v1/complaints/nearby/search` | `GET` | Public | Radius search around coordinates |
| `/api/v1/complaints/{id}/submit-resolution` | `POST` | Officer | Department submits completion evidence |
| `/api/v1/complaints/{id}/verify-resolution` | `POST` | Citizen | Complainant physically inspects & confirms resolution |
| `/api/v1/complaints/{id}/reject-resolution` | `POST` | Citizen | Complainant disputes resolution and reopens issue |
| `/api/v1/projects` | `GET` / `POST` | Public / Citizen | Participatory budgeting proposals |
| `/api/v1/projects/{id}/vote` | `POST` | Citizen | Verified vote on community proposal |
| `/api/v1/projects/rankings` | `GET` | Public | Live community project rankings |
| `/api/v1/tenders` | `GET` | Public | View municipal government tenders |
| `/api/v1/chat/message` | `POST` | Public | Multilingual Gemini Citizen Assistant |
| `/api/v1/public/complaints` | `GET` | Public | Transparent grievance feed (privacy filtered) |
| `/api/v1/admin/dashboard` | `GET` | Admin | Comprehensive municipal KPIs & queue |
| `/api/v1/contact` | `POST` | Public | Citizen contact & inquiry submission |

---

## 🔒 Security & Privacy Model
- **Complainant Privacy**: Public endpoints never return Aadhaar, email, phone number, or internal notes.
- **Passwords**: Hashed with modern, memory-hard **Argon2** algorithm.
- **Audit Logs**: Immutable log records appended to MongoDB for every sensitive civic event.
