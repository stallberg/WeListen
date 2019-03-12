# This file contains unit tests

from server import app
from databaseApi import DBApi
from text_to_speech import tts
import json
import pytest
from text_to_speech import tts

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

#Index page displaying forms
def test_index_page(client):
    rv = client.get('/')
    status_code = rv.status_code
    assert status_code == 200
    response = rv.data
    assert b'<title>We Listen - Forms</title>' in response

def test_car_insurance_form(client):
    rv = client.get('/forms/1/')
    status_code = rv.status_code
    assert status_code == 200
    response = rv.data
    assert b'<h1 id="form-title">Car Insurance Claim</h1>' in response

def test_bug_report_form(client):
    rv = client.get('/forms/2/')
    status_code = rv.status_code
    assert status_code == 200
    response = rv.data
    assert b'<h1 id="form-title">Bug Report</h1>' in response

def test_km_perdiem_form(client):
    rv = client.get('/forms/3/')
    status_code = rv.status_code
    assert status_code == 200
    response = rv.data
    assert b'<h1 id="form-title">Requesting Kilometre and Per Diem Allowance </h1>' in response

def test_car_insurance_json(client):
    rv = client.get('/forms/1/json/')
    json_data = json.loads(rv.data)
    assert len(json_data.keys()) == 4
    assert json_data['id'] == 1
    assert len(json_data['questions']) == 4
    print(json_data.keys())


def test_DBapi_get_forms(client):
    dbApi = DBApi()
    forms = dbApi.getForms()
    assert len(forms) == 3

def test_create_tts_url_without_options(client):
    url = tts.create_TTS_URL("Test question", None)
    assert type(url) == str
    assert len(url) > 0

def test_create_tts_url_with_options(client):
    options = [{'description': 'Yes'}, {'description': 'No'}]
    url = tts.create_TTS_URL("Test question", options)
    assert type(url) == str
    assert len(url) > 0


    
