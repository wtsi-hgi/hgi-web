#!/bin/bash

# Simple private key generator

# AGPLv3 or later
# Copyright (c) 2014 Genome Research Limited

read -r -d "" USAGE <<EOF
Usage: make-key.sh [options]

Options:
  -s SIZE     Key size, in bytes (default 256)
  -o KEYFILE  Key file (default hgi-web.key)
  -h          This useful message
EOF

# Defaults
KEYFILE=hgi-web.key
KEYSIZE=256

# Get command line options
NUMBER='^[1-9][0-9]*$'
while getopts ":s:o:h" opt; do
  case $opt in
    s)
      if ! [[ $OPTARG =~ $NUMBER ]]; then
        echo "Key size must be a positive integer"
        exit 1
      fi
      KEYSIZE=$OPTARG
      ;;
    o)
      KEYFILE=$OPTARG
      ;;
    h)
      echo "$USAGE"
      exit 0
      ;;
    \?)
      echo "No such option -$OPTARG"
      echo "$USAGE"
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument"
      echo "$USAGE"
      exit 1
      ;;
  esac
done

# Create key file
dd if=/dev/random of=$KEYFILE bs=$KEYSIZE count=1 &>/dev/null && \
ls -l $KEYFILE
