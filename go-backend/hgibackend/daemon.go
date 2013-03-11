package main

import (
	"github.com/emicklei/go-restful"
	"log"
	"net/http"
	"github.com/wtsi-hgi/hgi-web/go-backend/project"
)

func main() {
	restful.Add(project.NewService())
	log.Fatal(http.ListenAndServe(":8080", nil))
}

