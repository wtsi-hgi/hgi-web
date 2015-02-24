// Minimal HTML5 History HTTP Server

// MIT License
// Copyright (c) 2015 Genome Research Limited

var http = require('http'),
    fs   = require('fs');

http.createServer(function(req, res) {
  // Route /:integer? to single HTML end point
  if (/^\/\d*$/.test(req.url)) {
    var html = fs.createReadStream(__dirname + '/history.html');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    html.pipe(res);

  // Otherwise 404 Not Found
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3000);
