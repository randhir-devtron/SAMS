package routes

import (
	"fmt"
	"log"

	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	repo "github.com/randhir06/StdAttdMangSys/Repository"
	resthand "github.com/randhir06/StdAttdMangSys/RestHandlers"
	serv "github.com/randhir06/StdAttdMangSys/Services"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Corsmw(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// we need to allow this here
		// even ports make a difference for the origin
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		// If we are using the Authorization header we need to specify this here
		// https://stackoverflow.com/questions/10548883/request-header-field-authorization-is-not-allowed-error-tastypie
		w.Header().Set("Access-Control-Allow-Headers", "Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			return
		}

		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

func InitializeRouter() {
	r := mux.NewRouter()

	r.HandleFunc("/login", resthand.Login).Methods("POST", "OPTIONS")
	r.HandleFunc("/home", resthand.Home).Methods("GET", "OPTIONS")

	r.HandleFunc("/principals", resthand.GetPrincipals).Methods("GET", "OPTIONS")
	r.HandleFunc("/principal/{principalid}", resthand.GetPrincipal).Methods("GET", "OPTIONS")
	r.HandleFunc("/principal", resthand.AddPrincipal).Methods("POST", "OPTIONS")

	// Teacher
	r.HandleFunc("/teachers", resthand.GetTeachers).Methods("GET", "OPTIONS")
	r.HandleFunc("/teachers/{startswith}", resthand.GetTeachersStartWith).Methods("GET", "OPTIONS")
	r.HandleFunc("/teacher/{teacherid}", resthand.GetTeacher).Methods("GET", "OPTIONS")
	r.HandleFunc("/teacher", resthand.AddTeacher).Methods("POST", "OPTIONS")
	r.HandleFunc("/punchinteacher/{teacherid}", resthand.PunchInTeacher).Methods("POST", "OPTIONS")
	r.HandleFunc("/punchoutteacher/{teacherid}", resthand.PunchOutTeacher).Methods("POST", "OPTIONS")
	// Principal Can see the attendance of teachers
	r.HandleFunc("/teacher/{teacherid}/{month}/{year}", resthand.GetTeacherAttendance).Methods("GET", "OPTIONS")

	// Student
	r.HandleFunc("/students", resthand.GetStudents).Methods("GET", "OPTIONS")
	r.HandleFunc("/student/{id}", resthand.GetStudent).Methods("GET", "OPTIONS")
	r.HandleFunc("/student", resthand.AddStudent).Methods("POST", "OPTIONS")
	r.HandleFunc("/username", resthand.GetStudentID).Methods("GET", "OPTIONS")
	// Punch_In and Punch_Out for Students
	r.HandleFunc("/punchinstudent/{studentid}", resthand.PunchInStudent).Methods("POST", "OPTIONS")
	r.HandleFunc("/punchoutstudent/{studentid}", resthand.PunchOutStudent).Methods("POST", "OPTIONS")
	r.HandleFunc("/student/{class}/{day}/{month}/{year}", resthand.GetStudentAttendanceByClass).Methods("GET", "OPTIONS")
	r.HandleFunc("/student/{studentid}/{month}/{year}", resthand.GetStudentAttendanceById).Methods("GET", "OPTIONS")
	
	r.Use(Corsmw)
	r.Use(mux.CORSMethodMiddleware(r))
	log.Fatal(http.ListenAndServe((":9000"), r))
}

// InitialMigration Function to check if the Database is connecting or not
func InitialMigration() {
	var err error
	serv.DB, err = gorm.Open(postgres.Open(serv.DNS), &gorm.Config{})
	if err != nil {
		fmt.Println(err.Error())
		panic("Cannot connect to DB")
	}
	// DB.AutoMigrate(&User{})
	serv.DB.AutoMigrate(&repo.Principal{})
	serv.DB.AutoMigrate(&repo.Teacher{})
	serv.DB.AutoMigrate(&repo.Student{})
	serv.DB.AutoMigrate(&repo.Teacher_Attendance{})
	serv.DB.AutoMigrate(&repo.Student_Attendance{})
	serv.DB.AutoMigrate(&repo.Credentials{})
}
