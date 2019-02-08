FROM jenkins/jenkins:lts

RUN apt-get update \
      && apt-get install -y sudo \
      && rm -rf /var/lib/apt/lists/*
RUN echo "jenkins ALL=NOPASSWD: /usr/bin/docker" >> /etc/sudoers

ENV JENKINS_OPTS --httpPort=8080 --prefix=/jenkins
EXPOSE 8080