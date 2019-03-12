from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

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
