from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/')
def mainpage():
    return render_template("index.html", my_list=["Question 1 Here", "Question 2 Here", "Question 3 Here"])


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)


