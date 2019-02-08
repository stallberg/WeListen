docker run -d --name jenkins --restart always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /usr/bin/docker:/usr/bin/docker -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose \
-v jenkins_home:/var/jenkins_home --network="welisten_welisten" jenkins:welisten