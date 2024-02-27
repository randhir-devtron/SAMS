import { useState } from "react";
import NavBar from "../Student/NavBar";
import { getUserDataFromCookie } from "../../GetCookie";
import DateSelector from "../Student/DateSelector";
import InputData from "./InputData";
import { useNavigate } from "react-router-dom";
interface user {
    username: string;
    password: string;
    role: string;
    exp: number;
}

function Teacher() {
    console.log("Inside Teacher");
    const userData = getUserDataFromCookie() as user;
    const navigate = useNavigate();
    const username = userData.username;
    const Role = userData.role;
    console.log("UserData : ", userData);
    console.log("Role : ", Role);
    const email = "randhirkumar1062000@gmail.com";
    const teacherID = 3;
    const [StudentID, setStudentID] = useState<number>(-1);
    console.log("Student ID: ", StudentID);


    return (
        <>
            <button
                type="button"
                className="button"
                onClick={() => navigate("/studentlist")}
            >
                Students List :
            </button>

            <NavBar name={username} ID={teacherID} role={Role} email={email} />
            <InputData setStudentID={setStudentID} />
            <DateSelector role={Role} ID={StudentID} />
            {/* <StudentList /> */}
        </>
    );
}

export default Teacher;
