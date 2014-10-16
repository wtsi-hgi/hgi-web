# DOCKER-VERSION 1.2.0
FROM ubuntu:12.04

# Apache Reverse Proxy
# TODO

# Install Node.js, npm and brunch
RUN apt-get update
RUN apt-get -y install python-software-properties python g++ make
RUN add-apt-repository -y ppa:chris-lea/node.js-legacy
RUN apt-get update
RUN apt-get -y install nodejs=0.8.28-1chl1~precise1
RUN apt-get -y install npm=1.3.0-1chl1~precise1
RUN npm install -g brunch

# Bundle and install frontend
COPY node-frontend /frontend
RUN cp /frontend/app/settings.coffee.tmpl /frontend/app/settings.coffee
RUN cd /frontend; npm install

EXPOSE 8080
