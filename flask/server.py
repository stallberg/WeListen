from flask import Flask, request, render_template, jsonify

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


# TODO: Create proper routes and fetch stuff from database
@app.route('/')
def mainpage():
    return render_template("index.html")

@app.route('/bug-report')
def bugform():
    return render_template("form.html")

@app.route('/bug-report.json')
def fetch_bug_form():
    form = test()
    return jsonify(form)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
