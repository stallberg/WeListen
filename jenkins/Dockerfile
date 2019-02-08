FROM jenkins/jenkins:lts

USER root
RUN apt-get update \
      && apt-get install -y libltdl7

RUN groupadd docker -g 999 \
    && usermod -aG docker jenkins



USER jenkins
ENV JENKINS_OPTS --httpPort=8080 --prefix=/jenkins
EXPOSE 8080
