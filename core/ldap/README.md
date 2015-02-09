# Directory Enquiries

This service runs as a read-only LDAP client. While it may be accessed
by end users, it is intended to be consumed by other services for their
authorisation purposes.

## Environment Variables

The following environment variables should be set for the service:

* `LDAPHOST` The LDAP server URL (i.e., `ldap://host:port`)
* `BASEDN` The base distinguished name in the directory (per
  [RFC2253](https://www.ietf.org/rfc/rfc2253.txt))
* `PORT` The port on which the client service will listen
