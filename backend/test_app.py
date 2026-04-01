import pytest
from app import app, db, Comment

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()
        yield client

def test_create_comment(client):
    response = client.post('/comments', json={'text': 'Patient may have high cholesterol'})
    assert response.status_code == 201
    assert response.json['text'] == 'Patient may have high cholesterol'

def test_invalid_comment(client):
    response = client.post('/comments', json={'text': ''})
    assert response.status_code == 400
