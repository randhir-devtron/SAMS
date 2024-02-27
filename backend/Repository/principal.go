package repository

import (
	"gorm.io/gorm"
)

// principal Table
type Principal struct {
	gorm.Model
	// Principal_Id  string `json:"principalid" gorm:"primaryKey"`
	FirstName     string `json:"firstname"`
	LastName      string `json:"lastname"`
	Email         string `json:"email"`
	Qualification string `json:"qualification"`
}
