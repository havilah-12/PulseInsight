# 📊 Database Schema

This document describes the purpose and relationships of each table in the **LabReport Analyzer** PostgreSQL schema.

---

## 🧾 Tables Overview

### 1. `patients`

**Purpose:**  
Stores metadata about individual patients.

**Key Columns:**  
- `id` *(Primary Key)*  
- `name`, `age`, `gender`, etc.

**Relationships:**  
- One-to-many with `lab_reports` (a patient can have multiple lab reports)

---

### 2. `lab_reports`

**Purpose:**  
Represents a complete lab report submitted for a patient.

**Key Columns:**  
- `id` *(Primary Key)*  
- `patient_id` *(Foreign Key → patients.id)*  
- `report_date`

**Relationships:**  
- One-to-many with `report_items`  
- One-to-one or one-to-many with `comments`

---

### 3. `report_items`

**Purpose:**  
Stores detailed test results within a lab report (e.g., glucose levels, TSH, etc.).

**Key Columns:**  
- `id` *(Primary Key)*  
- `lab_report_id` *(Foreign Key → lab_reports.id)*  
- `test_name`, `value`, `unit`, `reference_range`

---

### 4. `comments`

**Purpose:**  
Free-text interpretation or analysis of lab results. May be written by a doctor or auto-generated.

**Key Columns:**  
- `id` *(Primary Key)*  
- `lab_report_id` *(Foreign Key → lab_reports.id)*  
- `text` *(Comment content)*

---

### 5. `disease_analytics`

**Purpose:**  
Stores NLP-extracted disease names and severity levels from comments.

**Key Columns:**  
- `id` *(Primary Key)*  
- `comment_id` *(Foreign Key → comments.id)*  
- `disease_name`  
- `severity` *(e.g., Low, Medium, High)*

---

## 🔗 Relationships Summary

- A `patient` can have multiple `lab_reports`  
- Each `lab_report` can have multiple `report_items`  
- Each `lab_report` can be associated with one or more `comments`  
- Each `comment` can produce multiple `disease_analytics` entries via NLP  

---

## 🛠 Notes

- NLP processing (powered by spaCy) extracts `disease_name` and `severity` from `comments.text`  
- Severity classification is rule-based, defined in the `/semantic_analysis` module




