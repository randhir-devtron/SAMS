package repository

import (
	"time"

	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Class     string `json:"class"`
}

// Student_Attendance Table
type Student_Attendance struct {
	gorm.Model
	Student_Id   string    `json:"studentid"`
	PunchInTime  time.Time `json:"punchintime" gorm:"default:CURRENT_TIMESTAMP"`
	PunchOutTime time.Time `json:"punchouttime" gorm:"default:CURRENT_TIMESTAMP"`
	Day          int       `json:"day"`
	Month        int       `json:"month"`
	Year         int       `json:"year"`
	DutyTime     time.Time `json:"dutytime"`
	Student      Student   `gorm:"foreignKey:Student_Id"`
}
