#!/bin/bash

HOSTPORT=$1
if [ -z "$1" ]; then HOSTPORT=80; fi

docker run -p $HOSTPORT:9000 -d frontend 
