package dao

import (
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
	"github.com/wtsi-hgi/hgi-web/go-backend/model"
//	"log"
)

type ProjectDao struct {
	Collection *mgo.Collection
}

func (self ProjectDao) Exists(id string) bool {
	_, err := self.FindById(id)
	return err == nil
}

func (self ProjectDao) FindAll() ([]model.Project, error) {

	result := []model.Project{}
	err := self.Collection.Find(bson.M{}).All(&result)

	return result, err
}

func (self ProjectDao) FindById(id string) (model.Project, error) {

	result := model.Project{}
	err := self.Collection.FindId(id).One(&result)

	return result, err
}

func (self ProjectDao) Save(p *model.Project) (dbid string, err error) {

	query := bson.M{"id": p.Id}

	if p.Id == "" {
		query = nil
	}
	
	ci, err := self.Collection.Upsert(query, p)

	if ci.UpsertedId != nil {
		dbid = ci.UpsertedId.(bson.ObjectId).Hex()
	} else {
		dbid = p.DbId.Hex()
	}
	
	return dbid, err
}

func (self ProjectDao) RemoveById(id string) error {
	query := bson.M{"id": id}
	return self.Collection.Remove(query)
}

