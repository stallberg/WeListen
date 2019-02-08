docker run -d --name jenkins \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $(which docker):$(which docker) -v $(which docker-compose):$(which docker-compose) \
-v jenkins_home:/var/jenkins_home --network="welisten_welisten" jenkins:welisten