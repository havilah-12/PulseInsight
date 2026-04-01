-- Patients Table
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    gender CHAR(1),
    age INTEGER
);

-- Lab Reports Table
CREATE TABLE lab_reports (
    report_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(patient_id),
    report_date DATE NOT NULL,
    report_type VARCHAR(100)
);

-- Report Items Table (Test-level details)
CREATE TABLE report_items (
    item_id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES lab_reports(report_id),
    test_name VARCHAR(100),
    value VARCHAR(50),
    unit VARCHAR(20),
    min_value VARCHAR(20),
    max_value VARCHAR(20),
    impression VARCHAR(10)
);

-- Comments Table (Doctor remarks)
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES lab_reports(report_id),
    text TEXT NOT NULL CHECK (length(text) <= 250)
);

-- Indexes
CREATE INDEX idx_report_date ON lab_reports(report_date);
CREATE INDEX idx_comment_text ON comments USING GIN (to_tsvector('english', text))
