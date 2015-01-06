# MongoDB Schema

MongoDB documents are arbitrary blobs of JSON/BSON, but we need to
specify some kind of schema so that the API knows what to expect. Thus
each collection has a special template document, with an `_id` of
`_template`... Think of it as type annotation for a schemaless database!

Anyway, the template document must contain a numeric `version` property
and a `template` array, which defines the expected fields. The template
array elements are objects of the form:

```js
{
  "name": /* Field Name :: String */,
  "type": /* Type Annotation :: See below */
}
```

For convenience, [`index.js`](index.js) will load all JSON files in the
working directory and, if they don't already exist, create a collection
with the same name and then update/create the template document as per
this definition, wherever necessary.

## Types

Value      | Description
-----------|-------------
`"string"` | String
`"number"` | Number
`"bool"`   | Boolean
Array      | Enumeration

*n.b., It's quite likely that this system will be expanded and refined
as need arises.*
