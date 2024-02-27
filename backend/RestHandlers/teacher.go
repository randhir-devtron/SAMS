package resthandlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	rep "github.com/randhir06/StdAttdMangSys/Repository"
	serv "github.com/randhir06/StdAttdMangSys/Services"
	"gorm.io/gorm"
)

// Get Teachers
func GetTeachers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var teacher []rep.Teacher
	serv.DB.Find(&teacher)
	json.NewEncoder(w).Encode(teacher)
}

func GetTeachersStartWith(w http.ResponseWriter, r *http.Request) {
	println("Call start in teacher");
	w.Header().Set("Content-Type", "application/json");
	params := mux.Vars(r);
	startsWith := params["startswith"];
	startsWith = "%" + startsWith+"%";
	var teacher []rep.Teacher
	println(startsWith);
	serv.DB.Where("first_name LIKE ?",startsWith).Find(&teacher);
	json.NewEncoder(w).Encode(teacher);
}

// Get Teacher
func GetTeacher(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var teacher rep.Teacher
	params := mux.Vars(r)
	err := serv.DB.First(&teacher, params["teacherid"])

	if err == nil {
		json.NewEncoder(w).Encode("No teacher exist")
		return
	}

	json.NewEncoder(w).Encode(teacher)
}

// Add a teacher into Teacher table
func AddTeacher(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var teacher rep.Teacher
	json.NewDecoder(r.Body).Decode(&teacher)
	serv.DB.Create(&teacher)
	username := teacher.FirstName + strconv.Itoa(int(teacher.ID))
	password := username
	println(username)
	println(password)
	credentials, err := AddCredentials(username, password, "Teacher")
	if err != nil {
		log.Printf("Error while fetching credentials %v", err)
		return
		// http.Error(w, "Error while adding credential from AddTeacher table", err)
	}
	// json.NewEncoder(w).Encode(teacher)
	json.NewEncoder(w).Encode(credentials)
}

// Delete a teacher from Teacher Table
func DeleteTeacher(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	var teacher rep.Teacher
	serv.DB.Delete(&teacher, params["id"])
	json.NewEncoder(w).Encode("The teacher is deleted successfully")
}

// Principle can See Teacher attendance using Teacher_Id, Month and Year
func GetTeacherAttendance(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	id := params["id"]
	month, err := strconv.Atoi(params["month"])
	if err != nil {
		http.Error(w, "Invalid month parameter", http.StatusBadRequest)
		return
	}
	year, err := strconv.Atoi(params["year"])
	if err != nil {
		http.Error(w, "Invalid year parameter", http.StatusBadRequest)
		return
	}

	teacherAttendance, err := fetchTeacherAttendance(id, month, year)
	if err != nil {
		http.Error(w, "Error fetching teacher attendance", http.StatusInternalServerError)
		return
	}

	// Convert the result to JSON and send it in the response
	json.NewEncoder(w).Encode(teacherAttendance)
}

func fetchTeacherAttendance(id string, month, year int) ([]rep.Teacher_Attendance, error) {
	var teacherattendance []rep.Teacher_Attendance

	result := serv.DB.Where("Teacher_Id = ? AND Month = ? AND Year = ?", id, month, year).Find(&teacherattendance)
	if result.Error != nil {
		return nil, result.Error
	}

	return teacherattendance, nil
}

// PunchIn handler for teachers for the very first time
func PunchInTeacher(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	TeacherId := params["teacherid"]
	// Create a new instance of Student_Attendance
	day := time.Now().Day()
	month := int(time.Now().Month())
	year := time.Now().Year()
	var teacherAttendance rep.Teacher_Attendance
	result := serv.DB.Where("Day = ? AND Month = ? AND Year = ? And Teacher_Id = ?", day, month, year, TeacherId).First(&teacherAttendance)
	if result.Error == gorm.ErrRecordNotFound {
		println("Recrd not found in techer");
		teacherattendance := rep.Teacher_Attendance{
			Teacher_Id:   TeacherId,
			PunchInTime:  time.Now(),
			PunchOutTime: time.Now(),
			Day:          time.Now().Day(),
			Month:        int(time.Now().Month()),
			Year:         time.Now().Year(),
		}
		// var teacherattendance Teacher_Attendance
		json.NewDecoder(r.Body).Decode(&teacherattendance)
		serv.DB.Unscoped().Create(&teacherattendance)
		json.NewEncoder(w).Encode(teacherattendance)
		return
	}
	if result.Error!=nil{
		http.Error(w, "Error while Fetching Student Attendance ", http.StatusBadRequest)
		return
	}
	// Check if PunchIntTime <= PunchOutTime
	// println(teacherAttendance.PunchInTime)
	// println(teacherAttendance.PunchOutTime)
	if teacherAttendance.PunchOutTime.After(teacherAttendance.PunchInTime) {
		teacherAttendance.PunchInTime = time.Now()
		result = serv.DB.Save(&teacherAttendance)
		if result.Error != nil {
			http.Error(w, "Error updating teacher attendance record", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(teacherAttendance)
		return
	}
	json.NewEncoder(w).Encode("Can not Punch In Again")
}

// PunchOut handler for teachers
func PunchOutTeacher(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	TeacherId := params["teacherid"]
	day := time.Now().Day()
	month := int(time.Now().Month())
	year := time.Now().Year()
	var teacherAttendance rep.Teacher_Attendance
	result := serv.DB.Where("Day = ? AND Month = ? AND Year = ? And Teacher_Id = ?", day, month, year, TeacherId).First(&teacherAttendance)
	if result.Error == gorm.ErrRecordNotFound {
		// Handle the error
		http.Error(w, "Failed to retrieve teacher attendance", http.StatusInternalServerError)
		return
	}
	if result.Error != nil {
		http.Error(w, "Error while fetching teacher attendance", http.StatusInternalServerError)
		return
	}
	teacherAttendance.PunchOutTime = time.Now()
	// jsonNewDecoder(r.Body).Decode(&teacherattendance)
	serv.DB.Save(&teacherAttendance)
	json.NewEncoder(w).Encode(teacherAttendance)
}
