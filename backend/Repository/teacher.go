package repository

import (
	"time"

	"gorm.io/gorm"
)

// Teacher Table
type Teacher struct {
	gorm.Model
	FirstName     string `json:"firstname"`
	LastName      string `json:"lastname"`
	Email         string `json:"email"`
	Qualification string `json:"qualification"`
}

// Teacher_Attendance Table
type Teacher_Attendance struct {
	gorm.Model
	Teacher_Id   string    `json:"teacherid"`
	PunchInTime  time.Time `json:"punchintime" default:"CURRENT_TIMESTAMP"`
	PunchOutTime time.Time `json:"punchouttime" default:"CURRENT_TIMESTAMP"`
	Day          int       `json:"day" default:"currentDay"`
	Month        int       `json:"month" default:"currentMonth"`
	Year         int       `json:"year" default:"currentYear"`
	DutyTime     time.Time `json:"dutytime"`
	Teacher      Teacher   `gorm:"foreignKey:Teacher_Id"`
}
