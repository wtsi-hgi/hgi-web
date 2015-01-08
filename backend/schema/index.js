// Create the API database on a specified MongoDB server
// Run as: mongo [HOST[:PORT]] index.js

// AGPLv3
// Copyright (c) 2015 Genome Research Limited

// DB_NAME must be defined in db.conf
var DB_NAME = cat('./db.conf').trim();

var conn = new Mongo(),
    db   = conn.getDB(DB_NAME);

// OK, so MongoDB is "schemaless", insofar as records are just arbitrary
// JSON/BSON documents. However, whatever consumes our data will
// attribute semantic meaning to various bits and pieces. Specifically,
// our RESTful API needs some kind of typing, so legal data can be
// pushed back into it. As such, collections will each have a versioned
// document that defines a template for that collection's documents...

// JavaScript: Shoehorning the old into the new since 1995.

// Gather collection schemata from filesystem
var schema = (function() {
  var collections   = {},
      parseFilename = /^(?:\.\/)?(\w+)\.json$/,
      parts;

  listFiles().forEach(function(f) {
    if (!f.isDirectory && (parts = parseFilename.exec(f.name))) {
      // parts[1] will be the basename with the extension stripped
      collections[parts[1]] = JSON.parse(cat(f.name));
      collections[parts[1]]['_id'] = "_template";
    }
  });

  return collections;
})();

var available      = db.getCollectionNames(),
    templateSchema = {'_id': '_template'};

// Create or update the collections
Object.keys(schema).forEach(function(c) {
  var update = false;

  if (available.indexOf(c) < 0) {
    // Create new collection
    print('Creating collection \'' + c + '\'');
    db.createCollection(c);
    update = true;

  } else {
    // Check template needs updating
    var template = db.getCollection(c).findOne(templateSchema);
    update = template ? template.version < schema[c].version
                      : true;
  }

  if (update) {
    // Update collection template, if appropriate
    print('Updating template for \'' + c + '\'');
    db.getCollection(c).update(templateSchema, schema[c], {upsert: true});
  }
});

print('Done');
