-- Query 1: Fetch all reports for a patient, ordered by date
SELECT r.report_id, r.report_date, r.report_type
FROM lab_reports r
JOIN patients p ON r.patient_id = p.patient_id
WHERE p.name = 'John Doe'
ORDER BY r.report_date DESC;

-- Query 2: Search comments containing a keyword (e.g., 'cholesterol')
SELECT c.comment_id, c.text, r.report_date, p.name
FROM comments c
JOIN lab_reports r ON c.report_id = r.report_id
JOIN patients p ON r.patient_id = p.patient_id
WHERE to_tsvector('english', c.text) @@ to_tsquery('cholesterol');
