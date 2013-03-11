package application

import (
	"github.com/wtsi-hgi/hgi-web/go-backend/model"
//	"log"
	)

func (self Logic) AllProjects() (model.Projects, error) {
	projects, err := self.ProjectDao.FindAll()
	if err != nil {
		return model.Projects{}, err
	}
	return model.Projects{projects}, nil
}

func (self Logic) SaveProject(p *model.Project) (id string, err error) {
	// TODO: validate project data

	id, err = self.ProjectDao.Save(p)

	return id, err
}

func (self Logic) GetProject(id string) (model.Project, error) {
	return self.ProjectDao.FindById(id)
}

func (self Logic) ExistsProject(id string) bool {
	return self.ProjectDao.Exists(id)
}
