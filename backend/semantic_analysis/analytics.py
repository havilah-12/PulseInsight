import os
import json
import warnings
from flask import Blueprint, jsonify
import spacy
from negspacy.negation import Negex
from models import Comment , DiseaseAnalytics ,db

# Suppress logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore")

# Setup
analytics_bp = Blueprint("analytics", __name__)
nlp = spacy.load("en_ner_bc5cdr_md")
nlp.add_pipe("sentencizer", first=True)

# Config
MAPPING_FILES = [
    "data/medical_abbreviations.json",
    "data/medical_terms.json", 
    "data/disease_synonyms.json",
    "data/custom_terms.json"
]

SKIP_TERMS = {"patient", "man", "woman", "person", "boy", "girl", "child"}

SEVERITY_MAP = {
    "severe": "High", "critical": "High", "high": "High",
    "mild": "Low", "slight": "Low", "possible": "Low", 
    "moderate": "Medium", "elevated": "Medium"
}

def load_medical_terms():
    """Load all medical term mappings"""
    all_terms = {}
    
    for file_path in MAPPING_FILES:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    all_terms.update(flatten_dict(data))
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
    
    return all_terms

def flatten_dict(data):
    """Flatten nested dictionary"""
    result = {}
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, str):
                result[key] = value
            elif isinstance(value, dict):
                result.update(flatten_dict(value))
    
    return result

def setup_nlp_pipeline():
    """Setup NLP pipeline with medical terms"""
    medical_terms = load_medical_terms()
    
    # Add custom medical terms
    if "entity_ruler" in nlp.pipe_names:
        nlp.remove_pipe("entity_ruler")
    
    ruler = nlp.add_pipe("entity_ruler", before="ner")
    patterns = []
    
    for term, normalized in medical_terms.items():
        if term.strip():
            pattern = [{"LOWER": word} for word in term.lower().split()]
            patterns.append({
                "label": "DISEASE", 
                "pattern": pattern, 
                "id": normalized
            })
    
    ruler.add_patterns(patterns)
    
    # Add negation detection
    if "negex" not in nlp.pipe_names:
        nlp.add_pipe("negex", config={"ent_types": ["DISEASE"]}, last=True)

def get_severity(text):
    """Determine severity from text with context awareness"""
    text = text.lower()
    
    # Check for negated severity terms first
    negated_patterns = [
        "not that high", "not severe", "not critical", "not too high",
        "not very high", "not really high", "not extremely", "not terribly"
    ]
    
    for pattern in negated_patterns:
        if pattern in text:
            return "Low"
    
    # Check for mild/controlled indicators
    mild_patterns = [
        "controlled", "managed", "stable", "under control", 
        "well controlled", "not bad", "okay", "fine"
    ]
    
    for pattern in mild_patterns:
        if pattern in text:
            return "Low"
    
    # Check regular severity keywords
    for keyword, level in SEVERITY_MAP.items():
        if keyword in text:
            return level
    
    return "Medium"

def extract_diseases(text):
    """Extract diseases from text"""
    doc = nlp(text)
    diseases = []
    
    for sentence in doc.sents:
        for entity in sentence.ents:
            # Check if it's a disease, not negated, and not a generic term
            if (entity.label_ == "DISEASE" and 
                not getattr(entity._, "negex", False) and
                entity.text.strip().lower() not in SKIP_TERMS):
                
                diseases.append({
                    "name": entity.ent_id_ or entity.text.strip(),
                    "severity": get_severity(sentence.text)
                })
    
    return diseases if diseases else [{"name": "None", "severity": "None"}]

# Initialize pipeline
setup_nlp_pipeline()
@analytics_bp.route("/comments-by-disease/<disease_name>", methods=["GET"])
def get_comments_by_disease(disease_name):
    entries = DiseaseAnalytics.query.filter_by(disease=disease_name).all()
    comment_ids = {e.comment_id for e in entries}
    comments = Comment.query.filter(Comment.id.in_(comment_ids)).all()

    return jsonify({
        "disease": disease_name,
        "comments": [c.text for c in comments]
    })

@analytics_bp.route("/analyze", methods=["GET"])
def analyze_comments():
    try:
        comments = Comment.query.all()
        DiseaseAnalytics.query.delete()  # Optional: Clear old analytics
        db.session.commit()

        for comment in comments:
            diseases = extract_diseases(comment.text)
            
            for disease in diseases:
                if disease["name"] != "None":
                    analytics = DiseaseAnalytics(
                        comment_id=comment.id,
                        comment_text=comment.text,
                        disease_name=disease["name"],
                        severity=disease["severity"]
                    )
                    db.session.add(analytics)

        db.session.commit()

        return jsonify({"message": "Disease analytics stored successfully."})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to store analytics", "details": str(e)}), 500

