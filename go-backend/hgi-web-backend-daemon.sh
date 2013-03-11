#!/bin/bash

HGI_WEB_BACKEND=$(dirname $0)
GOPATH=${HGI_WEB_BACKEND}/go

go get github.com/emicklei/go-restful
go get labix.org/v2/mgo

go install github.com/wtsi-hgi/hgi-web/go-backend/hgibackend

#(cd ${HGI_WEB_BACKEND} && go install -gcflags "-N -l" hgi-web-backend/hgibackend/daemon.go && ./bin/hgibackend $@)

