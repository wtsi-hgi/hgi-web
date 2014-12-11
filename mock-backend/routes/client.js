// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var mongo = require('mongodb').MongoClient,
    noid  = {'_id': 0};

// Connection pool of client gateways
var clientGateway = (function() {
  var gateways = {};

  // Access client database
  // name :: Client name
  // callback :: function(err, Client database)
  var main = function(name, callback) {
    if (!gateways.hasOwnProperty(name)) {
      // No such client
      var err = new Error('No such client');
      callback(err, null);

    } else {
      if (!gateways[name].db) {
        mongo.connect(gateways[name].href, function(err, db) {
          if (err) {
            callback(err, null);
          } else {
            console.log('Connected to %s client database', name);
            gateways[name].db = db;
            db.on('close', function() {
              console.log('Connection to client database closed');
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
        callback(err, null);
      } else {
        clients.find({}, noid).toArray(function(err, clientData) {
          if (err) {
            callback(err, null);
          } else {
            // Update cache
            clientData.forEach(function(client) {
              var refreshConnection = false;

              // Check if we need to do anything...
              if (gateways.hasOwnProperty(client.name)) {
                if (gateways[client.name].href != client.href) {
                  refreshConnection = true;
                }
              } else {
                gateways[client.name] = {};
                refreshConnection = true;
              }

              // ...and if we do
              if (refreshConnection) {
                var gateway = gateways[client.name];
                gateway.href = client.href;
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

var notDoneYet = function(req, res) {
  res.status(501).send('Not Implemented');
};

var ohCrap = function(err, req, res) {
  res.status(500)
     .send('Internal Server Error: ' + err.message);
};

module.exports = { 
  root: {
    get: function(req, res) {
      // Get list of registered clients
      clientGateway.init(req.db, function(err, clients) {
        if (err) {
          ohCrap(err, req, res);
        
        } else {
          // TODO Hypermedia content
          res.type('json');
          res.send(clients);
        }
      });
    },

    post:   notDoneYet, // Create new client
    delete: notDoneYet  // Delete client
  },

  id: {
    get: function(req, res) {
      clientGateway.init(req.db, function(err, clients) {
        if (err) {
          ohCrap(err, req, res);
        
        } else {
          var clientID = req.params.id;
          clientGateway(clientID, function(err, clientDB) {
            if (err) {
              ohCrap(err, req, res);

            } else {
              clientDB.collectionNames(function(err, collections) {
                res.send(collections);
              });
            }
          });
        }
      });


      // req.db.collection('_client', {strict: true}, function(err, clients) {
      //   if (err && !clients) {
      //     ohCrap(err, req, res);

      //   } else {
      //     var clientID = req.params.id;
      //     clients.findOne({'name': clientID}, {'_id': 0}, function(err, client) {
      //       if (err) {
      //         ohCrap(err, req, res);
      //       } else if (!client) {
      //         // Not cool
      //         res.status(404).send('No such client \'' + clientID + '\'');
      //       } else {
      //         var gateway = client.href || '';
      //         
      //         mongo.connect(gateway, function(err, clientDB) {
      //           if (err && !clientDB) {
      //             res.status(502).send('Bad Gateway');
      //           } else {
      //             clientDB.collectionNames(function(err, collections) {
      //               res.send(collections);
      //               clientDB.close();
      //             });
      //           }
      //         });
      //       }
      //     });
      //   }
      // });
    },

    post:   notDoneYet, // Create new client database
    delete: notDoneYet  // Delete client database
  },

  data: {
    get: function(req, res) {
      var clientID = req.params.id,
          dataID   = req.params.data,
          subPath  = req.params[0] ? req.params[0].substr(1).split('/') : [],
          dataObj;

      if (objAt(clients, [clientID])) {
        if (dataObj = objAt(clients, [clientID, dataID].concat(subPath))) {
          // TODO Hypermedia content
          res.type('json');
          res.send(dataObj);

        } else {
          // Not cool
          var dataKey = dataID + req.params[0];
          res.status(404).send('\'' + clientID + '\' has no \'' + dataKey + '\' data resource');
        }
      } else {
        // Not cool
        res.status(404).send('No such client \'' + clientID + '\'');
      }
    },

    post:   notDoneYet, // Create client database data
    put:    notDoneYet, // Update client database data
    patch:  notDoneYet, // Patch client database data
    delete: notDoneYet  // Delete client database data
  }
};
