// AGPLv3 or later
// Copyright (c) 2015 Genome Research Limited

var env = process.env;

module.exports = function(app, ldap) {
  var allowed = ( 'uid,cn,sn,givenName,mail,telephoneNumber,'
                + 'gidNumber,departmentNumber,sangerTeamName,'
                + 'roomNumber').split(',');

  // TODO What to do at root? Returning all matches is not realistic
  // app.get('/', WHAT?);

  app.get('/:uid/:attr?', function(req, res) {
    var uid  = req.params.uid,
        attr = req.params.attr;

    // Can only access allowed attributes
    if (attr && allowed.concat('jpegPhoto').indexOf(attr) == -1) {
      res.status(404).send('Not found');

    } else {
      var options = {
        filter:     '(sangerActiveAccount=TRUE)',
        attributes: attr || allowed,
        scope:      'sub'
      };

      if (uid) {
        options.filter = '(&' + options.filter + '(|'
                       + '(uid=' + uid + ')'
                       + '(mail=' + uid + ')))';
      }

      ldap.search(env.BASEDN, options, function(err, dres) {
        if (err) {
          req.log.error(err);
          res.status(500).send(err.message);
        
        } else {
          var toWrite;

          dres.on('searchEntry', function(entry) {
            if (attr) {
              // Special handler for photos
              if (attr == 'jpegPhoto') {
                res.set('Content-Type', 'image/jpeg');
                toWrite = entry.raw.jpegPhoto;

              // All other attributes
              } else {
                var output = {};
                output[attr] = entry.object[attr];
                toWrite = output;
              }

            // All attributes
            } else {
              var output = {};
              allowed.forEach(function(a) { // FIXME Blocking
                output[a] = entry.object[a];
              });
              toWrite = output;
            }
          });

          dres.on('error', function(err) {
            req.log.error(err);
            res.status(500).send(err.message);
          });

          dres.on('end', function(result) {
            if (!res.headersSent) {
              res.send(toWrite);
            }
          });
        }
      });
    }
  });

  // Catch all for anything else
  app.get('*', function(req, res) {
    res.status(404).send('Not found');
  });
};
