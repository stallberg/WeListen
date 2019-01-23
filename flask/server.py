from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

##Just temporary to try request the form from the server
def test():
    form = {
        'name': 'Defect Report Form',
        'questions': [
            {
                'question': "Please specify the title of the error",
                'answerType' : 'str',
                'answer': '',
            },
    
            {
                'question': "Which platform(s) are you using?",
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
                'answerType' : 'str',
                'answer': '',
            },
    
            {
                'question': "What is the severity of the error?",
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

@app.route('/bug-report')
def fetch_bug_form():
    form = test()
    return jsonify(form)

@app.route('/')
def mainpage():
    return render_template("index.html", my_list=["Question 1 Here", "Question 2 Here", "Question 3 Here"])


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
