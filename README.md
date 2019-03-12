This repository contains the code for the project course (team WeListen). The demo shown at ICT-showroom can be seen at https://welisten.macister.fi/

## Requirements for running the application locally
To run the application locally, the following is required:
- Python3 and the python package manager (pip)
- Node and the npm package manager
- A serice account key json file from Google Cloud Platform. This is required to have access to the google APIs being used. This json file needs to be set as an environment variable called GOOGLE_APPLICATION_CREDENTIALS

## Running the application with Docker
The application is fully containerized with Docker. Run `docker-compose up -d --build` to build and run the entire application based on the docker-compose.yaml configuration. Currently, docker is configured and used only for cloud deployment and not for local development. 
