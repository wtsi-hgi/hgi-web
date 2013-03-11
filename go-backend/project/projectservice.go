package project

import (
	restful "github.com/emicklei/go-restful"
)

type Project struct {
	Name    string
	Owner   string
}

type Projects struct{ Project []Project }


func NewService() *restful.WebService {
	ws := new(restful.WebService)
	
	ws.Path("/projects").
		Consumes(restful.MIME_XML, restful.MIME_JSON).
		Produces(restful.MIME_XML, restful.MIME_JSON)

	ws.Route(ws.GET("/").To(listProjects).
		Doc("Get a list of projects").
		Writes(Projects{}))

	ws.Route(ws.POST("/").To(newProject).
		Doc("Create a new project").
		Reads(Project{}).
		Writes(Project{}))

	ws.Route(ws.GET("/{id}").To(getProject).
		Doc("Get the project by its id").
		Param(ws.PathParameter("id" , "the identifier for the project")).
		Writes(Project{}))

	ws.Route(ws.PUT("/{id}").To(putProject).
		Doc("Replace the project given by id with the given data").
		Param(ws.PathParameter("id" , "the identifier for the project")).
		Reads(Project{}))

	ws.Route(ws.DELETE("/{id}").To(deleteProject).
		Doc("Delete the project given by id").
		Param(ws.PathParameter("id" , "the identifier for the project")))
//		Param(ws.QueryParameter("environment" , "the scope in which the application node lives")).
	
	return ws
}


func listProjects(request *restful.Request, response *restful.Response) {
	
}

func newProject(request *restful.Request, response *restful.Response) {
	
}

func getProject(request *restful.Request, response *restful.Response) {
	//id := request.PathParameter("id")
	//env := request.QueryParameter("environment")
	project := Project{
		Name:  "Foobaz",
		Owner:  "F. Barzane",
	}
	// response.AddHeader("X-Something","other")
	// response.WriteEntity(anApp) , uses Accept header to detect XML/JSON
	// response.WriterError(http.StatusInternal
	
	response.WriteEntity(project)
}

func putProject(request *restful.Request, response *restful.Response) {

}

func deleteProject(request *restful.Request, response *restful.Response) {

}

