// AGPLv3 or later
// Copyright (c) 2014 Genome Research Limited

var notDoneYet = function(req, res) {
  res.status(501).send('Not Implemented');
};

// Mock persistence
var clients = {
  'hgi-web': {
    'bookmarks': [
      {id: 'home',     name: 'Home',     href: ''},
      {id: 'projects', name: 'Projects', href: 'projects'},
      {id: 'about',    name: 'About',    href: 'about'},
      {id: 'contact',  name: 'Contact',  href: 'contact'},
    ]
  }
};

// This is nasty, but only temporary!
var objAt = function(object, path) {
  var pointer = object;

  // path should be array of strings
  path.forEach(function(p) {
    try      { pointer = pointer[p]; }
    catch(e) { return false; }
  });

  return pointer;
};

module.exports = { 
  root: {
    get: function(req, res) {
      req.db.collection('_client').find({}, {'_id': 0}).toArray(function(err, clients) {
        // TODO JSON Collection
        res.type('json');
        res.send(clients);
      });
    },

    post:   notDoneYet, // Create new client
    delete: notDoneYet  // Delete client
  },

  id: {
    get: function(req, res) {
      var clientID = req.params.id,
          clientObj;

      if (clientObj = objAt(clients, [clientID])) {
        // TODO JSON Collection
        res.type('json');
        res.send(clientObj);

      } else {
        // Not cool
        res.status(404).send('No such client \'' + clientID + '\'');
      }
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
          // TODO JSON Collection
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
