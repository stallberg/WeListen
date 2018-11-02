from flask import Flask, request, render_template

from watson_developer_cloud import AuthorizationV1 as Authorization
from watson_developer_cloud import SpeechToTextV1 as SpeechToText

from dotenv import load_dotenv
import os

load_dotenv('.env')

STT_USERNAME = os.environ.get('STT_USERNAME')
STT_PASSWORD = os.environ.get('STT_PASSWORD')


app = Flask(__name__)


@app.route('/')
def mainpage():
    return render_template("index.html")

@app.route('/api/speech-to-text/token')
def get_STT_token():
    authorization = Authorization(username=STT_USERNAME, password=STT_PASSWORD)
    return authorization.get_token(url=SpeechToText.default_url)



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)


