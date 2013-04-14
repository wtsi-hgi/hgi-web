package webservice

import (
	restful "github.com/emicklei/go-restful"
	"github.com/wtsi-hgi/hgi-web/go-backend/model"
	"github.com/wtsi-hgi/hgi-web/go-backend/application"
	"net/http"
//	"log"
)

func Project() *restful.WebService {
	ws := new(restful.WebService)
	
	ws.Path("/projects").
		Consumes(restful.MIME_XML, restful.MIME_JSON).
		Produces(restful.MIME_XML, restful.MIME_JSON)

	ws.Route(ws.GET("/").To(listProjects).
		Doc("Get a list of projects").
		Writes(model.Projects{}))

	ws.Route(ws.POST("/").To(createProject).
		Doc("Create a new project").
		Reads(model.Project{}).
		Writes(model.Project{}))

	ws.Route(ws.GET("/{id}").To(getProject).
		Doc("Get the project by its id").
		Param(ws.PathParameter("id" , "the identifier for the project")).
		Writes(model.Project{}))

	ws.Route(ws.PUT("/{id}").To(putProject).
		Doc("Replace the project given by id with the given data").
		Param(ws.PathParameter("id" , "the identifier for the project")).
		Reads(model.Project{}))

	ws.Route(ws.DELETE("/{id}").To(deleteProject).
		Doc("Delete the project given by id").
		Param(ws.PathParameter("id" , "the identifier for the project")))
//		Param(ws.QueryParameter("environment" , "the scope in which the applcation node lives")).
	
	return ws
}


func addCommonHeaders(response *restful.Response) {
	response.AddHeader("Access-Control-Allow-Origin", "*")
	response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
}

func listProjects(request *restful.Request, response *restful.Response) {
	projects, err := application.SharedLogic.AllProjects()
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	addCommonHeaders(response)
	response.WriteEntity(projects)
}

func createProject(request *restful.Request, response *restful.Response) {

	project := new(model.Project)
	err := request.ReadEntity(&project)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	// TODO: validate?
	dbid, err := application.SharedLogic.SaveProject(project)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
	}

	addCommonHeaders(response)
	response.WriteEntity(dbid)
}

func getProject(request *restful.Request, response *restful.Response) {
	id := request.PathParameter("id")
	//env := request.QueryParameter("environment")
	// response.AddHeader("X-Something","other")
	// response.WriteEntity(anApp) , uses Accept header to detect XML/JSON
	// response.WriterError(http.StatusInternal
	project, err := application.SharedLogic.GetProject(id)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	
	addCommonHeaders(response)
	response.WriteEntity(project)
}

func putProject(request *restful.Request, response *restful.Response) {

	addCommonHeaders(response)

}

func deleteProject(request *restful.Request, response *restful.Response) {

	addCommonHeaders(response)
}

