// Main app file. Loads the .env file, runs setup code, and starts the server.

var express = require('express'),
    setup   = require('./lib/setup'),
    env     = require('node-env-file');

env(__dirname + '/.env');
var app = module.exports = express();
setup(app);

// Start the server and send a message to IPC for the integration test
// helper to hook into.
app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + process.env.PORT);
  if(process.send) process.send('listening');
});
