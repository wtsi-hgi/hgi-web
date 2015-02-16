# Directory Enquiries

This service currently acts as a read-only LDAP client. While it may be
accessed by end users, it is intended to be consumed by other services
for their authorisation purposes.

All data served by this service is plain JSON and, as such, cannot be
inherently RESTful as it fails the HATEOAS constraint. However, profile
linking is supported using the Link response header field, per
[RFC5988](http://www.rfc-editor.org/rfc/rfc5988.txt). Again, profile
documents can be arbitrary, so won't necessarily satisfy the hypermedia
requirement, so it is up to the service's administrator to enforce this.

*TODO* Translate recognised FQDNs (i.e., those which are routed) into
respective URLs.

## Routing

The mapping between LDAP FQDNs and URLs is defined in `mapping.json`,
which uses the following schema:

```json
{
  "/route": {
    "dn":      "o=fqdn,dc=example,dc=com",
    "scope":   "one",
    "attrs":   ["o", "cn"],
    "profile": "/url/to/profile"
  },

  "/route/:param": {
    "dn":      "cn=:param,o=fqdn,dc=example,dc=com",
    "attrs":   ["cn"]
  }
}
```

Note that `scope` should be one of `base` (default, if omitted or not
recognised), `one`, `sub` or `children`. The `attrs` array specifies the
attributes that should be returned by default (all, if omitted).

One might well ask why DNs are explicitly mapped out, rather than simply
projecting the LDAP tree directly on to URLs. Well ask that you might,
but:

* The LDAP tree structure is slightly richer than that provided by URLs,
  as DN components can be named arbitrarily. As such, there's no
  "natural" isomorphism\* between an LDAP directory and URL routes. One
  can project the LDAP tree on to URLs, but not vice versa, so you'd
  either have to construct the URL tree at startup from the LDAP root,
  or traverse the LDAP directory at runtime whenever a route is
  requested.
* One isn't necessarily interested in all branches of the LDAP tree;
  moreover, the required scope of the branches you *are* interested in
  may differ. For example, you probably wouldn't want an HTTP request to
  do a full subtree search from the root. Therein lies the path to
  madness.
* Flexibility and, to an extent, normalisation to URL constraints. For
  example, `ou=Research & Development,ou=Provincial Branch,o=CompuGlobalHyperMegaNet,dc=cghm,dc=net`
  could be routed to `/nerds`, if that's more appropriate.

When a DN has multiple attributes of the same name, this will be
converted into a JSON array. When an attribute is identified as usually
containing binary data, its data will be base64 encoded.

Note that if a non-base scope is specified, then chunked transfer
encoding is used to transmit the data to the client. If an error occurs
during the transfer (e.g., LDAP request timeout), then a special JSON
object will be appended to the end of the output array and the HTTP
connection closed. Said object will have a single key (`error`), which
will describe the problem.

If a `profile` document is specified, this will be included in the Link
HTTP response header, using the `profile` relation type. For example:

    Link: </url/to/profile>;rel=profile

(&#10034;) One could encode the DN components into the URL route, to
preserve that information for a direct mapping, but who wants to type
(or have to remember) something like:

    http://ldap.gateway/ou-departments/dept-hr/cn-staff/uid-jbloggs

### Query String Parameters

If you wish to only return specific attributes for a DN, provide them as
a comma delimited list to the `attrs` query string parameter. For
example:

    http://ldap.gateway/people/jbloggs?attrs=cn,sn,mail

This overrides the `attrs` value in the route mapping. If you wish to
override with *all* attributes, use `attrs=*`.

If you wish to filter the results, you may provide an LDAP filter (per
[RFC4515](http://tools.ietf.org/rfc/rfc4515.txt)) to the `q` query
string parameter. For example:

    http://ldap.gateway/people?q=(uid=jbloggs)

Note that the LDAP filter should be percent encoded. Browsers largely
let you get away with avoiding this, when writing the URL manually,
*apart* from when you want to do a conjunction. In which case, `&` is
encoded as `%26`. For example:

    http://ldap.gateway/people?q=(%26(sn=bloggs)(dept=foo))

## Profile Static Hosting

Profile documents may be statically hosted from this service, if
desired. However, there is no need to use this as a repository, it's
just provided as a convenience.

## Environment Variables

The following environment variables are consumed by the service:

* `LOGFILE` Keep a trace log in this file (n.b., this file will get
  *very* large, as all HTTP and LDAP communications will be logged; only
  use this for debugging purposes)
* `LDAPHOST` The LDAP server URL (i.e., `ldap(s)://host:port`)
* `BINDDN` The distinguished name all LDAP connections should be bound
  as (optional; per [RFC2253](http://www.ietf.org/rfc/rfc2253.txt))
* `BINDPWD` The credentials to use with `BINDDN`
* `POOLSIZE` The maximum number of LDAP connections (defaults to 10)
* `PROFDIR` The directory from where static profile documents are served
  (optional)
* `PROFROUTE` The route where static profile documents from `PROFDIR`
  are hosted (defaults to `/profiles`)
* `PORT` The port on which the client service will listen
