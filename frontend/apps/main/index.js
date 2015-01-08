// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var express = require('express'),
    routes  = require('./routes'),
    sd      = require('sharify').data;

var app = module.exports = express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

app.get(/^\/*$/,            routes.home);
app.get(/^\/*projects\/*$/, routes.projects);
app.get(/^\/*about\/*$/,    routes.about);
app.get(/^\/*contact\/*$/,  routes.contact);
