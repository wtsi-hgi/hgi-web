# Directory Enquiries

This service currently acts as a read-only LDAP client. While it may be
accessed by end users, it is intended to be consumed by other services
for their authorisation purposes.

## Routes

The mapping between LDAP FQDNs and URLs is defined in `mapping.json`,
which uses the following schema:

```json
{
  "/route": {
    "dn":    "o=fqdn,dc=example,dc=com",
    "scope": "one"
  },

  "/route/:param": {
    "dn":    "cn=:param,o=fqdn,dc=example,dc=com",
    "scope": "base"
  }
}
```

Note that `scope` should be one of `base` (default, if omitted), `one`,
`sub` or `children`.

If you wish to only return specific attributes for a DN, provide them as
a comma delimited list to the `attrs` query string element. For example:

    http://ldap.gateway/people/jbloggs?attrs=cn,sn,mail

If you wish to filter the results, you may provide an LDAP filter (per
[RFC4515](http://tools.ietf.org/rfc/rfc4515.txt)) to the `q` query
string element. For example:

    http://ldap.gateway/people?q=(uid=jbloggs)

Note that the LDAP filter should be percent encoded. Browsers largely
let you get away with avoiding this, *apart* from when you want to do a
conjunction. In which case, `&` is encoded as `%26`. For example:

    http://ldap.gateway/people?q=(%26(sn=bloggs)(dept=foo))

When a DN has multiple attributes of the same name, this will be
converted into a JSON array. When an attribute is identified to usually
contain binary data, this will be base64 encoded.

## Environment Variables

The following environment variables should be set for the service:

* `LOGFILE` Bunyan log file (defaults to `ldap.log`)
* `LDAPHOST` The LDAP server URL (i.e., `ldap://host:port`)
* `BINDDN` The distinguished name all LDAP connections should be bound
  as (optional; per [RFC2253](http://www.ietf.org/rfc/rfc2253.txt))
* `BINDPWD` The credentials to use with `BINDDN`
* `POOLSIZE` The maximum number of LDAP connections (defaults to 10)
* `PORT` The port on which the client service will listen
