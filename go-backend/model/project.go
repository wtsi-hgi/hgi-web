package model

import (	
	"labix.org/v2/mgo/bson"
)

type Project struct {
	DbId    bson.ObjectId  `bson:"_id,omitempty"   json:"dbid"    xml:"-"` // TODO can't get bson.ObjectId to output as a string in XML, coming out as byte array, so it's disabled
	Id      string         `bson:"id"              json:"id"      xml:"id"`
        Team    string         `bson:"team"            json:"team"    xml:"team"`
        Name    string         `bson:"name"            json:"name"    xml:"name"`
}

type ProjectsFilter struct {
	Teams []string
	Names []string
}

type Projects struct{ Project []Project }

