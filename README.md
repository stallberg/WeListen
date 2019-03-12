This repository contains the code for the project course 2018-2019 (team WeListen). The demo shown at ICT-showroom can be seen at https://welisten.macister.fi/

# Requirements for running the application locally
To run the application locally, the following is required:
- Python3 and the python package manager (pip)
- Node and the npm package manager
- A serice account key json file from Google Cloud Platform. This is required to have access to the google APIs being used. This json file needs to be set as an environment variable called GOOGLE_APPLICATION_CREDENTIALS

Next, install all the required dependencies for flask

```
pip install -r flask/requirements.txt
```

and for node

```
cd node
npm install
```
Run the flask web application server

```
python flask/server.py
```
and the node SocketIO server

```
node node/server.js
```
For local development, the application can be accessed at http://localhost:8000

## Running tests
The flask application contains both unit- and functional (automated UI) tests. They can be run as follows: 
```
cd flask
//run unittests
pytest

//run automated UI tests
python tests_functional.py
```
Note that the functional UI tests are currently configured with the Firefox web browser in mind. This requires having the geckodriver in the system PATH (https://github.com/mozilla/geckodriver/releases).


# Running the application with Docker
The application is fully containerized with Docker. Run `docker-compose up -d --build` to build and run the entire application based on the docker-compose.yaml configuration. Currently, docker is configured and used only for cloud deployment and not for local development. 
