from flask import Flask, request, render_template, jsonify

#from sqlalchemy import create_engine
#from sqlalchemy.orm import sessionmaker

app = Flask(__name__)

##Just temporary to try request the form from the server
## TODO: properly fetch from database
def test():
    form = {
        'name': 'Defect Report Form',
        'questions': [
            {
                'question': "Please specify the title of the error",
                'audio': 'https://storage.googleapis.com/speech_recognition_audio/q1.mp3',
                'answerType' : 'str',
                'answer': '',
            },
    
            {
                'question': "Which platform(s) are you using?",
                'audio': 'https://storage.googleapis.com/speech_recognition_audio/q2.mp3',
                'answerType' : 'checkbox',
                'options': [
                    {'description': 'Desktop'},
                    {'description': 'Mobile'},
                    {'description': 'Tablet'},
                ],
                'answer': [],
            },
    
            {
                'question': "Please describe the error details",
                'audio': 'https://storage.googleapis.com/speech_recognition_audio/q3.mp3',
                'answerType' : 'str',
                'answer': '',
            },
    
            {
                'question': "What is the severity of the error?",
                'audio': 'https://storage.googleapis.com/speech_recognition_audio/q4.mp3',
                'answerType': 'multi',
                'options': [
                    {
                        'description': 'High'
                    },
                    {
                        'description': 'Medium'
                    },
                    {
                        'description': 'Low'
                    }
                ],
                'answer': '',
            }
        ]
    }
    return form


# Index page that gets rendered with all the forms in database
@app.route('/')
def mainpage():
    #Get all the forms from the DB
    forms = dbApi.getForms()
    return render_template("index.html", forms=forms)


@app.route('/forms/<form_id>/')
def renderForm(form_id):
    print("id = {}".format(form_id))
    form = dbApi.retrieveForm(form_id)
    return render_template("form.html", form_name=form['name'], form_id=form_id)

@app.route('/forms/<form_id>/json/')
def getFormJson(form_id):
    form = dbApi.retrieveForm(form_id)
    print(form)
    return jsonify(form)


if __name__ == '__main__':
    from databaseApi import DBApi
    dbApi = DBApi()
    app.run(host='0.0.0.0', port=8000, debug=True)
