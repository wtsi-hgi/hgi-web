# Bearer Token Provider

This Node.js shell script ought to be run as a CGI script behind a
Shibboleth gateway on the host server.

n.b., Don't forget to `npm install` to fetch the required dependencies.

The generated token, once authenticated, will encode the Shibboleth
ePPN (user ID) and session ID, with an expiration time, by taking the
HMAC with a private key and cryptographic salt.

## Environment Variables

The following environment variables should be set for the provider:

* `KEYFILE` The private key used to authenticate the token
* `LIFETIME` The token lifetime, in seconds (optional; defaults to 3600)
