package main

import (
	"flag"
	"log"
	goproperties "github.com/dmotylev/goproperties"
	restful "github.com/emicklei/go-restful"
	"labix.org/v2/mgo"
	"github.com/wtsi-hgi/hgi-web/go-backend/dao"
	"github.com/wtsi-hgi/hgi-web/go-backend/application"
	"github.com/wtsi-hgi/hgi-web/go-backend/webservice"
	"net/http"
)

var configFile string

func init() {
	flag.StringVar(&configFile, "config_file", "hgibackend.conf", "Configuration file")
}

func main() {
	log.Print("[hgibackend] starting...")
	
	flag.Parse()

	config, _ := goproperties.Load(configFile)

	mangoses, _ := mgo.Dial(config["mongo.connection"])
	defer mangoses.Close()

	projDao := dao.ProjectDao{mangoses.DB(config["mongo.database"]).C("projects")}
	
	application.SharedLogic = application.Logic{projDao}
	
	restful.Add(webservice.Project())
	
	baseUrl := "http://" + config["http.server.host"] + ":" + config["http.server.port"]
	
	swaggerConf := restful.SwaggerConfig{
		WebServicesUrl:  baseUrl,
		ApiPath:         config["swagger.api"],
		SwaggerPath:     config["swagger.path"],
		SwaggerFilePath: config["swagger.home"],
	}
	restful.InstallSwaggerService(swaggerConf)

	log.Printf("[hgibackend] about to start serving at %v\n", baseUrl)
	log.Fatal(http.ListenAndServe(":" + config["http.server.port"], nil))
}

