package application

import (
	"github.com/wtsi-hgi/hgi-web/go-backend/dao"
	)

var SharedLogic Logic

type Logic struct {
	ProjectDao dao.ProjectDao
}

