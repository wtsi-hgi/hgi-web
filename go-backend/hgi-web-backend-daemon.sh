#!/bin/bash

HGI_WEB_BACKEND_RELDIR=$(dirname $0)
HGI_WEB_BACKEND=$(cd $HGI_WEB_BACKEND_RELDIR && pwd)
export GOPATH="$HGI_WEB_BACKEND/go"

echo "Getting go package sources"
go get github.com/wtsi-hgi/hgi-web/go-backend/hgibackend || exit

echo "Installing go packages"
go install github.com/wtsi-hgi/hgi-web/go-backend/hgibackend || exit

echo "Running hgibackend"
$GOPATH/bin/hgibackend $@
