# Project A.L.I.G.N.
## Autonomous Land Integration & GeoAI Network for Urban Cadastral Record Harmonization
**Ministry of Rural Development (DoLR / NAKSHA & SVAMITVA) | Problem Statement: SIH26013**

[![Vercel Production](https://img.shields.io/badge/Vercel-Live%20Deployment-10b981?style=for-the-badge&logo=vercel)](https://sih-project-align.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-sih__project__align-06b6d4?style=for-the-badge&logo=github)](https://github.com/aayushbamal/sih_project_align)

---
### 🌐 Live Production Application
👉 **[https://sih-project-align.vercel.app](https://sih-project-align.vercel.app)**

### Key Features
1. **Interactive Split-Screen Swipe Comparison**: Real-time before/after comparison between legacy cloth maps (*Shajra*) and AI-snapped boundaries (*SAM-2 + nDSM Eaves*).
2. **3D Digital Twin Height Extrusion**: Extruded parcel structures using Normalized DSM heights with foundation-to-eave snapping ($0.4\text{m}$).
3. **Automated Topological Conflation**: Vertex snap-rounding ($\epsilon=15\text{cm}$), sliver elimination ($<2.0\text{m}^2$), strict 0 overlaps and 0 self-intersections.
4. **Multilingual Semantic Linking**: IndicSoundex phonetic tokenization + Levenshtein distance matching Devanagari records to English registries.
5. **Instant Bhu-Aadhaar ULPIN & QR Title Card Generator**: Scannable cryptographic QR verification code + one-click PDF title card download.
6. **Conflict Resolution Matrix & Statutory Legal Notices**: Automated Section 248 Land Revenue Code legal notice generation for 28 detected municipal encroachments.

---

### Quickstart Guide

#### 1. Backend GeoAI Microservice (FastAPI + Shapely 2.0)
```bash
cd backend
# Activate virtual environment
.venv\Scripts\activate
# Run test suite
pytest -v -s
# Start FastAPI server
python -m uvicorn app.main:app --port 8000 --host 127.0.0.1
```

#### 2. Frontend Interactive WebGIS Command Center (React 18 + Vite + Tailwind CSS)
```bash
cd frontend
# Start Vite development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
