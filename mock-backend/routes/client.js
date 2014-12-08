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

var clientKeys = Object.keys(clients),
    dataKeys   = {};

clientKeys.forEach(function(client) {
  dataKeys[client] = Object.keys(clients[client]);
});

module.exports = {
  root: {
    get: function(req, res) {
      // TODO
      res.type('json');
      res.send(clientKeys);
    },

    post:   notDoneYet, // Create new client
    delete: notDoneYet  // Delete client
  },

  id: {
    get: function(req, res) {
      var clientID = req.params.id;

      if (clientKeys.indexOf(clientID) != -1) {
        // TODO
        res.type('json');
        res.send(dataKeys[clientID]);

      } else {
        // Not cool
        res.status(404).send('No such client \'' + clientID + '\'');
      }
    },

    post:   notDoneYet, // Create new client function
    delete: notDoneYet  // Delete client function
  },

  fn: {
    get: function(req, res) {
      var clientID = req.params.id,
          dataID   = req.params.fn;

      if (clientKeys.indexOf(clientID) != -1) {
        if (dataKeys[clientID].indexOf(dataID) != -1) {

          // TODO
          res.type('json');
          res.send(clients[clientID][dataID]);

        } else {
          // Not cool
          res.status(404).send('\'' + clientID + '\' has no \'' + dataID + '\' resource');
        }
      } else {
        // Not cool
        res.status(404).send('No such client \'' + clientID + '\'');
      }
    },

    post:   notDoneYet, // Create client function data
    put:    notDoneYet, // Update client function data
    patch:  notDoneYet, // Patch client function data
    delete: notDoneYet  // Delete client function data
  }
};
