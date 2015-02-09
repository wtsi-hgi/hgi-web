# Directory Enquiries

This service runs as a read-only LDAP client. While it may be accessed
by end users, it is intended to be consumed by other services for their
authorisation purposes.

## Routes

### `GET /:uid`

Return a JSON document containing a useful subset of `:uid`'s
attributes. Note that `:uid` is queried against either the LDAP `uid` or
`mail` attributes.

### `GET /:uid/:attr`

Return a JSON document with just the specific `:attr` belonging to
`:uid`. Note that the available attribute routes are limited to those
returned from `/:uid`.

### `GET /:uid/jpegPhoto`

Return the JPEG photo associated with `:uid`.

## Environment Variables

The following environment variables should be set for the service:

* `LOGFILE` Bunyan log file (defaults to `ldap.log`)
* `LDAPHOST` The LDAP server URL (i.e., `ldap://host:port`)
* `POOLSIZE` The maximum number of connections (defaults to 5)
* `BASEDN` The base distinguished name in the directory (per
  [RFC2253](https://www.ietf.org/rfc/rfc2253.txt))
* `PORT` The port on which the client service will listen
