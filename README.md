# 🧬 LabReport Analyzer

LabReport Analyzer is a full-stack project that extracts disease mentions and their severity from unstructured lab report comments using NLP. It stores structured data in a PostgreSQL database and provides REST APIs for interaction.

---

# 🌟 Features

- 🧠 Disease and severity extraction using spaCy  
- 🗃️ PostgreSQL database for structured storage  
- ⚙️ Flask-based backend with REST API  
- 💻 React + TypeScript frontend for visualization and interaction  
- 🧾 SQL scripts for schema, sample data, and analytics queries  
- 🧪 Includes unit tests using pytest  

---

# 🛠️ Tech Stack

- 🐍 Python (Flask)  
- 🧬 spaCy (NLP)  
- 🏗️ SQLAlchemy (ORM)  
- 🐘 PostgreSQL (Database)  
- ⚛️ React + TypeScript (Frontend)  
- ✅ Pytest (Testing)
- ⚡ Vite (Build Tool)

---

# 📁 Repository Structure

- `app.py` - Flask app entry point  
- `db_schema/` - SQL files: schema, inserts, queries  
- `semantic_analysis/` - NLP logic (spaCy + rules)  
- `test_app.py` - Unit tests for comment API  
- `frontend/` - React + TypeScript frontend 
- `requirements.txt` - Python dependencies  
- `README.md` - Project documentation  

---

# 🚀 How to Run the Backend (Flask API)

## 🔧 Step 1: Setup Environment

- Create a virtual environment:
  - `python -m venv venv`
  - `source venv/bin/activate` (Linux/macOS)
  - `venv\Scripts\activate` (Windows)

- Install dependencies:
  - `pip install -r requirements.txt`

## ▶️ Step 2: Run the Flask Server

- Run the app:
  - `python app.py`
- The API will be available at:
  - `http://127.0.0.1:5000`

## 🧪 Step 3: API Testing

- Use curl, Postman, or browser to test endpoints

---

# 💻 How to Run the Frontend 

## 📂 Step 1: Navigate to Frontend Directory

- `cd frontend`

## 📦 Step 2: Install Dependencies

- `npm install`

## 🟢 Step 3: Start Development Server

- `npm start`  
- Open browser at: `http://localhost:5173`

---

# 📡 API Endpoints

## ✏️ Comments CRUD

- `GET /comments` – Retrieve all comments  
- `POST /comments` – Create a new comment  
- `PUT /comments/<id>` – Update an existing comment  
- `DELETE /comments/<id>` – Delete a comment  

## 📊 NLP & Analytics

- `GET /disease-distribution` – Frequency of diseases  
- `GET /analytics-stats` – Dashboard metrics  
- `GET /comments-analytics` – Comments with NLP annotations  

---

# ✅ Validation Rules

- Comment `text` must not be empty  
- Maximum length: **250 characters**  
- Returns HTTP `400` with error message if invalid  

---

# 🧪 How to Run Tests

- From project root:
  - `pytest test_app.py`

### 🔍 Test Cases:

- Valid comment creation  
- Rejection of invalid input (empty or too long)  

---

# 🗂️ PostgreSQL Schema

- Defined in: `db_schema/schema.sql`  
- Includes tables:
  - `patients`  
  - `lab_reports`  
  - `report_items`  
  - `comments`  
  - `disease_analytics`

- Additional SQL files:
  - `db_schema/sample_data.sql` – Sample insertions  
  - `db_schema/queries.sql` – Example analytical queries  

---
# 📌 Notes

- Flask server uses *SQLite (in-memory)* by default  
- PostgreSQL schema is available for production setup  
- NLP logic is implemented in semantic_analysis/ using *spaCy* and rule-based logic  
- Frontend consumes the REST API exposed by the backend
- Database schema in `db_schema/schema.sql` — load before running app.  
- ORM models defined in `models.py` (SQLAlchemy). 
- Input validation rules in `schema.py` (max 250 chars, non-empty).  
- Unit tests in `test_app.py` (run with `pytest`).  
- Flask entry point: `app.py`.
