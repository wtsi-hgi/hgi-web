# DOCKER-VERSION 1.3.0
FROM    ubuntu:12.04

# Refresh package list
RUN     apt-get update

# Install and set up Apache as a reverse proxy
RUN     apt-get -y install apache2 libapache2-mod-proxy-html
COPY    apache2.conf /etc/apache2/app.conf
RUN     cat /etc/apache2/app.conf >> /etc/apache2/apache2.conf
RUN     service apache2 start

# Install Node.js, npm and brunch
RUN     apt-get -y install python-software-properties python g++ make
RUN     add-apt-repository -y ppa:chris-lea/node.js-legacy
RUN     apt-get update
RUN     apt-get -y install nodejs=0.8.28-1chl1~precise1
RUN     apt-get -y install npm=1.3.0-1chl1~precise1
RUN     npm install -g brunch

# Bundle and install frontend
COPY    node-frontend /frontend
COPY    start-frontend.sh /
RUN     cp /frontend/app/settings.coffee.tmpl /frontend/app/settings.coffee
RUN     cd /frontend; npm install

EXPOSE  80
CMD     ["./start-frontend.sh"]
