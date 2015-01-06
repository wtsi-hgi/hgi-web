// Create the API database (hgi-web-api) on a specified MongoDB server
// Run as: mongo HOST[:PORT] index.js

// AGPLv3
// Copyright (c) 2015 Genome Research Limited

var DB_NAME = 'hgi-web-api';

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
  var collections = {},
      isJSONExt   = /\.json$/,
      getBasename = /^\.\/(\w+)\.json$/;

  listFiles().forEach(function(f) {
    if (!f.isDirectory && isJSONExt.test(f.name)) {
      var basename = f.name.replace(getBasename, '$1');
      collections[basename] = JSON.parse(cat(f.name));
    }
  });

  return collections;
})();

var available      = db.getCollectionNames(),

    exists         = {"$exists": true},
    templateSchema = {version: exists, template: exists};

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
