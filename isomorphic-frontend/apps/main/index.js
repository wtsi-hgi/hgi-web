var express = require('express'),
    routes  = require('./routes'),
    sd      = require('sharify').data;

var app = module.exports = express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.get(sd.BASE_PATH + '/',         routes.home);
app.get(sd.BASE_PATH + '/projects', routes.projects);
app.get(sd.BASE_PATH + '/about',    routes.about);
app.get(sd.BASE_PATH + '/contact',  routes.contact);
