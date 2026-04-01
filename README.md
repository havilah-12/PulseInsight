# PulseInsight

PulseInsight is a full-stack healthcare analytics platform for uploading lab records, classifying each test result, generating AI-assisted remarks and next-step suggestions, and exporting patient-friendly reports in CSV or PDF.

---
<img width="1578" height="974" alt="image" src="https://github.com/user-attachments/assets/48a3a15a-36f8-4923-9ba4-c1a7d5ef68ab" />


## Features

- AI-assisted lab test interpretation through `backend/llm_integration.py`
- Patient profile dashboard with grouped test sections
- Individual patient report view with React-generated body profile graphic
- CSV upload workflow for batch patient analysis
- CSV and PDF report exports, including per-patient PDF downloads
- Flask REST API with SQLAlchemy persistence
- React + TypeScript frontend powered by Vite
- Pytest-based backend test support

---

## Tech Stack

- Python + Flask
- SQLAlchemy ORM
- SQLite in-memory by default, PostgreSQL-ready configuration
- React + TypeScript + Vite
- Recharts, React Query, Tailwind-based UI
- ReportLab for PDF generation
- Pytest for tests

---

<img width="1883" height="985" alt="image" src="https://github.com/user-attachments/assets/402dcf69-0ced-447f-829d-0055bb1eae14" />

<img width="1848" height="967" alt="image" src="https://github.com/user-attachments/assets/5cb4fff7-e0c8-4af8-a310-3642823bc505" />

## Repository Structure

- `backend/app.py` - Flask API, upload flow, analytics, CSV/PDF export
- `backend/llm_integration.py` - AI interpretation layer for test classification
- `backend/models.py` - patient and parameter persistence model
- `frontend/` - React app for dashboard, upload, charts, and patient reports
- `sample_data.csv` - sample upload dataset
- `README.md` - project overview and run instructions

---

## Run The Backend

- `cd backend`
- `py -3.10 -m pip install -r requirements.txt`
- `py -3.10 -c "from app import app; app.run(port=5001, debug=False)"`
- Backend will run at `http://127.0.0.1:5001`

---

## Run The Frontend

- `cd frontend`
- `npm install`
- `npm run dev`
- Frontend will run at `http://localhost:5173`
- The frontend is configured to call the backend at `http://127.0.0.1:5001`

---

## API Endpoints

- `POST /upload` - upload a CSV and analyze patient lab tests
- `GET /patients` - list all patient profiles with grouped test data
- `GET /patients/<id>` - view an individual patient report payload
- `DELETE /patients/<id>` - delete a patient profile
- `GET /analytics-stats` - top-level dashboard statistics
- `GET /parameter-distribution` - warning distribution by parameter
- `GET /export-report` - download full CSV report
- `GET /export-report/pdf` - download full PDF report
- `GET /patients/<id>/export-report/pdf` - download individual patient PDF report

---

## AI Layer

- Located in `backend/llm_integration.py`
- Accepts patient age plus test parameters
- Returns:
  - `status`: `Good`, `Warning`, or `Critical`
  - `remarks`
  - `suggestions`
- Falls back to simple mock logic when no API key is available

---

## Run Tests

- `cd backend`
- `pytest test_app.py`

---

## Notes

- The default backend database is SQLite in-memory, so uploaded data resets when the server stops
- For production-style usage, switch to a persistent database configuration
- If port `5000` is blocked on your machine, the current setup uses `5001`
- The frontend build now completes successfully with `npm run build`
