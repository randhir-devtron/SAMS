package main

import (
	"fmt"

	rout "github.com/randhir06/StdAttdMangSys/Routes"
	serv "github.com/randhir06/StdAttdMangSys/Services"
	// _ "github.com/lib/pq"
)


func main() {
	rout.InitialMigration()
	rout.InitializeRouter()
	serv.DB.Exec("ALTER TABLE teacher_attendance ADD FOREIGN KEY (teacher_id) REFERENCES teacher(id);")
	serv.DB.Exec("ALTER TABLE student_attendance ADD FOREIGN KEY (student_id) REFERENCES student(id);")
	fmt.Println("Successfully connected!")
}
