-- Patients
INSERT INTO patients (name, gender, age) VALUES 
('John Doe', 'M', 45),
('Jane Smith', 'F', 32);

-- Lab Reports
INSERT INTO lab_reports (patient_id, report_date, report_type) VALUES 
(1, '2023-07-01', 'Blood Panel'),
(1, '2023-07-15', 'Thyroid Profile'),
(2, '2023-07-12', 'Liver Function');

-- Report Items
INSERT INTO report_items (report_id, test_name, value, unit, min_value, max_value, impression) VALUES
(1, 'Cholesterol', '240', 'mg/dL', '0', '200', 'High'),
(2, 'TSH', '5.6', 'µIU/mL', '0.5', '4.5', 'High'),
(3, 'Bilirubin', '1.8', 'mg/dL', '0.2', '1.2', 'High');

-- Comments
INSERT INTO comments (report_id, text) VALUES
(1, 'Patient has high cholesterol. Dietary changes recommended.'),
(2, 'Possible hypothyroidism. Suggest endocrine consult.'),
(3, 'Elevated bilirubin. Suspect liver dysfunction.');
