package main

import (
	"github.com/emicklei/go-restful"
	"log"
	"net/http"
	"github.com/wtsi-hgi/hgi-web/go-backend/project"
)

func main() {
	restful.Add(project.NewService())

	config := restful.SwaggerConfig{
		WebServicesUrl: "http://localhost:8080",
		ApiPath: "/apidocs.json",
		SwaggerPath: "/apidocs/",
		SwaggerFilePath: "/Users/jr17/swagger-ui-1.1.7",
	}
	restful.InstallSwaggerService(config)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

