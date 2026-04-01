from flask import Flask, request, jsonify, send_file
from models import db, PatientRecord, ParameterAnalysis
from dotenv import load_dotenv
from llm_integration import evaluate_parameters
from flask_cors import CORS
import os
import io
import csv
import pandas as pd

load_dotenv()

DB_TYPE = os.getenv("DB_TYPE", "sqlite")
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

if DB_TYPE == "postgres":
    POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost/lab_reports")
    app.config["SQLALCHEMY_DATABASE_URI"] = POSTGRES_URL
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/patients', methods=['GET'])
def get_patients():
    patients = PatientRecord.query.all()
    result = []
    for p in patients:
        params = ParameterAnalysis.query.filter_by(patient_id=p.id).all()
        # Find if any parameter is a warning
        status = "positive"
        if any(param.status in ["Warning", "Critical"] for param in params):
            status = "warning"
            
        result.append({
            'id': p.id,
            'name': p.name or f"Patient {p.id}",
            'age': p.age,
            'status': status,
            'parameters': [{"name": pr.parameter_name, "value": pr.parameter_value, "status": pr.status, "remarks": pr.remarks, "suggestions": pr.suggestions} for pr in params]
        })
    return jsonify(result), 200

@app.route('/patients/<int:id>', methods=['GET'])
def get_patient(id):
    p = PatientRecord.query.get_or_404(id)
    params = ParameterAnalysis.query.filter_by(patient_id=p.id).all()
    status = "positive"
    if any(param.status in ["Warning", "Critical"] for param in params):
        status = "warning"
        
    result = {
        'id': p.id,
        'name': p.name or f"Patient {p.id}",
        'age': p.age,
        'status': status,
        'parameters': [{"name": pr.parameter_name, "value": pr.parameter_value, "status": pr.status, "remarks": pr.remarks, "suggestions": pr.suggestions} for pr in params]
    }
    return jsonify(result), 200

@app.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):
    patient = PatientRecord.query.get_or_404(id)
    db.session.delete(patient)
    db.session.commit()
    return jsonify({'message': 'Patient deleted'}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            df = pd.read_csv(file)
            
            # Identify columns
            cols = [c.strip() for c in df.columns]
            name_col = next((c for c in cols if "name" in c.lower()), None)
            age_col = next((c for c in cols if "age" in c.lower()), None)
            
            inserted_count = 0
            for idx, row in df.iterrows():
                # Extract basic info
                name = str(row[name_col]) if name_col and pd.notna(row[name_col]) else f"Unknown"
                age = str(row[age_col]) if age_col and pd.notna(row[age_col]) else "Unknown"
                
                # If everything is empty skip
                if name == "Unknown" and age == "Unknown" and all(pd.isna(row[c]) for c in cols if c not in [name_col, age_col]):
                    continue
                
                patient = PatientRecord(name=name, age=age)
                db.session.add(patient)
                db.session.flush() # Get ID
                
                # Extract parameters
                param_dict = {}
                for col in cols:
                    if col == name_col or col == age_col:
                        continue
                    val = row[col]
                    if pd.notna(val) and str(val).strip() != "":
                        param_dict[col] = str(val)
                
                if param_dict:
                    # Evaluate via LLM
                    try:
                        evaluations = evaluate_parameters(age, param_dict)
                    except Exception as llm_err:
                        print(f"LLM parsing failed: {llm_err}")
                        evaluations = {k: {"status": "Warning", "remarks": "Error"} for k in param_dict.keys()}
                    
                    for param_name in param_dict.keys():
                        struct = evaluations.get(param_name, {})
                        if isinstance(struct, dict):
                            status = struct.get("status", "Warning")
                            remarks = struct.get("remarks", "")
                            suggestions = struct.get("suggestions", "")
                        else:
                            status = "Warning"
                            remarks = ""
                            suggestions = ""
                            
                        original_val = param_dict.get(param_name, "N/A")
                        
                        analysis = ParameterAnalysis(
                            patient_id=patient.id,
                            parameter_name=param_name,
                            parameter_value=original_val,
                            status=status,
                            remarks=remarks,
                            suggestions=suggestions
                        )
                        db.session.add(analysis)
                        
                inserted_count += 1
                
            db.session.commit()
            return jsonify({"message": f"Successfully uploaded and analyzed {inserted_count} patients."}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Only .csv files are supported at this time."}), 400

@app.route('/export-report', methods=['GET'])
def export_report():
    analytics_records = ParameterAnalysis.query.all()
    
    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerow(['ID', 'Patient Name', 'Age', 'Parameter', 'Value', 'Status', 'Remarks', 'Suggestions'])
    
    for record in analytics_records:
        cw.writerow([
            record.id, 
            record.patient.name, 
            record.patient.age, 
            record.parameter_name, 
            record.parameter_value, 
            record.status, 
            record.remarks,
            record.suggestions
        ])
    
    output = io.BytesIO()
    output.write(si.getvalue().encode('utf-8'))
    output.seek(0)
    
    return send_file(
        output,
        mimetype='text/csv',
        as_attachment=True,
        download_name='structural_lab_report_analytics.csv'
    )

@app.route("/parameter-distribution", methods=["GET"])
def parameter_distribution():
    # Show distribution of warnings by parameter
    data = db.session.query(
        ParameterAnalysis.parameter_name,
        db.func.count(ParameterAnalysis.id)
    ).filter(ParameterAnalysis.status.in_(["Warning", "Critical"]))\
     .group_by(ParameterAnalysis.parameter_name).all()

    results = [
        {"parameter": name, "warnings": count}
        for name, count in data
    ]
    return jsonify(results)

@app.route("/analytics-stats", methods=["GET"])
def analytics_stats():
    total_patients = db.session.query(db.func.count(PatientRecord.id)).scalar()
    total_parameters = db.session.query(db.func.count(ParameterAnalysis.id)).scalar()
    warnings = db.session.query(db.func.count(ParameterAnalysis.id)).filter(ParameterAnalysis.status.in_(["Warning", "Critical"])).scalar()
    resolved = total_parameters - warnings if total_parameters else 0

    return jsonify({
        "total_patients": total_patients,
        "active_parameters": total_parameters,
        "warnings": warnings,
        "resolved": resolved
    })

if __name__ == '__main__':
    app.run(debug=True)