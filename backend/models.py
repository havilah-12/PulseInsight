from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PatientRecord(db.Model):
    __tablename__ = 'patient_records'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    age = db.Column(db.String(50), nullable=True)
    
    analytics = db.relationship('ParameterAnalysis', backref='patient', lazy=True, cascade="all, delete-orphan")


class ParameterAnalysis(db.Model):
    __tablename__ = 'parameter_analytics'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient_records.id'), nullable=False)
    parameter_name = db.Column(db.String(255), nullable=False)
    parameter_value = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    remarks = db.Column(db.Text, nullable=True)
    suggestions = db.Column(db.Text, nullable=True)
