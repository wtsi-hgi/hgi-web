# Directory Enquiries

This service currently acts as a read-only LDAP client. While it may be
accessed by end users, it is intended to be consumed by other services
for their authorisation purposes.

## Routes

The mapping between LDAP FQDNs and URLs is defined in `mapping.json`,
which uses the following schema:

```json
{
  "/route":        "o=fqdn,dc=example,dc=com",
  "/route/:param": "cn=:param,o=fqdn,dc=example,dc=com"
}
```

If you wish to only return specific attributes for a DN, provide them as
a comma delimited list to the `attrs` query string. For example:

    http://ldap.gateway/people/jbloggs?attrs=cn,sn,mail

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
