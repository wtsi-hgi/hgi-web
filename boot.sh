#!/bin/bash

HOSTPORT=$1
if [ -z "$1" ]; then HOSTPORT=80; fi

docker run -p $HOSTPORT:80 -d frontend 
