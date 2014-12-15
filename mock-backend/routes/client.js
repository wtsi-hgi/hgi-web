// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var mongo    = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;

// Error handling
var ServerError = function(status, message) {
  this.status  = status;
  this.message = message;
};

ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.constructor = ServerError;
ServerError.prototype.name = 'ServerError';

// Expand as necessary...
// http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
ServerError.prototype.httpStatus = {
  '400': 'Bad Request',
  '404': 'Not Found',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway'
};

// Don't throw, we want to keep the server up
ServerError.prototype.handle = function(req, res) {
  var message = this.httpStatus[this.status] || 'Unknown Error';
  if (this.message) { message += ': ' + this.message; }

  res.status(this.status).send(message);
};

// 501 Lazy Developer
var notDoneYet = function(req, res) {
  var excuse = (function() {
    var excuses = [  
      'Rome wasn\'t built in a day',
      'Give me a chance!',
      'Whip the lazy developer',
      '...',
      'It\'s too late for me. Save yourselves!',
      'I\'m waiting to be motivated'
    ];

    return excuses[Math.floor(Math.random() * excuses.length)];
  })();

  (new ServerError(501, excuse)).handle(req, res);
};

// Connection pool of client gateways
var clientGateway = (function() {
  var gateways = {};

  // Access client database
  // name :: Client name
  // callback :: function(err, Client database)
  var main = function(name, callback) {
    if (!gateways.hasOwnProperty(name)) {
      // No such client
      callback(new ServerError(404, 'No such client \'' + name + '\''), null);

    } else {
      if (!gateways[name].db) {
        mongo.connect(gateways[name].url, function(err, db) {
          if (err) {
            callback(new ServerError(502, err.message), null);

          } else {
            console.log('Connected to %s client database', name);
            gateways[name].db = db;
            db.on('close', function() {
              console.log('Connection to %s client database closed', name);
              gateways[name].db = null;
            });

            callback(null, gateways[name].db);
          }
        });

      } else {
        callback(null, gateways[name].db);
      }
    }
  };

  // Initialise/refresh client connection pool
  // db :: Mongo DB
  // callback :: function(err, Client array)
  main.init = function(db, callback) {
    // Attempt to open the _client collection
    db.collection('_client', {strict: true}, function(err, clients) {
      if (err && !clients) {
        callback(new ServerError(500, err.message), null);

      } else {
        var exists = {'$exists': true},
            schema = {name: exists, url: exists};

        clients.find(schema, {'_id': false}).toArray(function(err, clientData) {
          if (err) {
            callback(new ServerError(500, err.message), null);

          } else {
            // Update cache
            clientData.forEach(function(client) {
              var refreshConnection = false;

              // Check if we need to do anything...
              if (gateways.hasOwnProperty(client.name)) {
                if (gateways[client.name].url != client.url) {
                  refreshConnection = true;
                }

              } else {
                gateways[client.name] = {};
                refreshConnection = true;
              }

              // ...and if we do
              if (refreshConnection) {
                var gateway = gateways[client.name];
                gateway.url = client.url;
                if (gateway.db) { gateway.db.close(); }
              }
            });

            // Return list of clients
            callback(null, clientData);
          }
        });
      }
    });
  };

  // Close connection pool on SIGINT
  process.on('SIGINT', function() {
    for (client in gateways) {
      if (gateways.hasOwnProperty(client) && gateways[client].db) {
        gateways[client].db.close();
      }
    }
  });

  return main;
})();

// OK, now we can actually do the route handlers!
module.exports = { 
  root: {
    get: function(req, res) {
      // Get list of registered clients
      clientGateway.init(req.db, function(err, clients) {
        if (err) {
          err.handle(req, res);
        
        } else {
          // TODO Hypermedia content
          res.type('json');
          res.send(clients);
        }
      });
    },

    post:   notDoneYet, // Create new client gateway
    put:    notDoneYet, // Update client gateway
    delete: notDoneYet  // Delete client gateway
  },

  id: {
    get: function(req, res) {
      clientGateway.init(req.db, function(err, clients) {
        if (err) {
          err.handle(req, res);
        
        } else {
          var clientID = req.params.id;
          clientGateway(clientID, function(err, clientDB) {
            if (err) {
              err.handle(req, res);

            } else {
              clientDB.collectionNames(function(err, collections) {
                var clientCollections = collections
                  .map(function(c) {
                    // Strip database name
                    c.name = c.name.replace(clientDB.databaseName + '.', '');
                    return c;
                  })
                  .filter(function(c) {
                    // Remove system collections
                    return !/^system\./.test(c.name);
                  });

                // TODO Hypermedia content
                res.send(clientCollections);
              });
            }
          });
        }
      });
    },

    post:   notDoneYet, // Create new client collection
    delete: notDoneYet  // Delete client collection
  },

  data: {
    get: function(req, res) {
      clientGateway.init(req.db, function(err, clients) {
        if (err) {
          err.handle(req, res);

        } else {
          var clientID = req.params.id;
          clientGateway(clientID, function(err, clientDB) {
            if (err) {
              err.handle(req, res);

            } else {
              var collectionID = req.params.coll;
              clientDB.collection(collectionID, {strict: true}, function(err, collection) {
                if (err) {
                  // Check that collection actually exists
                  clientDB.collection('system.namespaces')
                    .find({name: clientDB.databaseName + '.' + collectionID})
                    .count(function(foo, n) {
                      var status  = 500,
                          message = err.message;

                      if (n == 0) {
                        status  = 404;
                        message = 'No such collection \'' + collectionID + '\'';
                      }

                      (new ServerError(status, message)).handle(req, res);
                    });

                } else {
                  if (req.params.doc) {
                    // Get the specific document
                    var documentID = (function(id) {
                      try {
                        var docID = new ObjectID(id);
                      } catch(e) { 
                        docID = null;
                      }
                      return docID;
                    })(req.params.doc);

                    collection.findOne({'_id': documentID}, function(err, document) {
                      if (err) {
                        (new ServerError(500, err.message)).handle(req, res);
                      
                      } else if (!documentID) {
                        (new ServerError(400, 'Invalid ObjectID')).handle(req, res);

                      } else if (!document) {
                        (new ServerError(404, 'No such document with ObjectID(\'' + documentID + '\')')).handle(req, res);

                      } else {
                        // TODO Hypermedia content
                        res.type('json');
                        res.send(document);
                      }
                    });

                  } else {
                    // Get the whole collection
                    collection.find().toArray(function(err, data) {
                      // TODO Hypermedia content
                      res.type('json');
                      res.send(data);
                    });
                  }
                }
              });
            }
          });
        }
      });
    },

    post:   notDoneYet, // Create client collection data
    put:    notDoneYet, // Update client collection data
    patch:  notDoneYet, // Patch client collection data
    delete: notDoneYet  // Delete client collection data
  }
};
