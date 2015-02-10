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

## Environment Variables

The following environment variables should be set for the service:

* `LOGFILE` Bunyan log file (defaults to `ldap.log`)
* `LDAPHOST` The LDAP server URL (i.e., `ldap://host:port`)
* `POOLSIZE` The maximum number of LDAP connections (defaults to 5)
* `PORT` The port on which the client service will listen
