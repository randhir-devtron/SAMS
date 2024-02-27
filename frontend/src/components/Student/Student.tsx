// import { Calendar } from "react-modern-calendar-datepicker";
import NavBar from "./NavBar";
import DateSelector from "./DateSelector";
import React from "react";
// import CalendarStudent from "./CalendarStudent";
import { getUserDataFromCookie } from "../../GetCookie";

const Student: React.FC = () => {
    let isUser = false;
    const userData = getUserDataFromCookie() as { username: string, password: string, role: string, exp: number };
    if (userData == null) {
        return;
    }
    const username = userData.username
    const Role = userData.role;
    const email = "randhirkumar1062000@gmail.com";
    const ID = 2;
    if (Role != 'Student') {
        console.log("User does not have access to this page");
        return;
    }
    else {
        isUser = true;
    }
    if (!isUser) {
        return <h1>404 Wrong Credentials</h1>

    }
    return <div style={{ display: (isUser ? "block" : "none") }}>
        <NavBar name={username} ID={3} role={Role} email={email} />
        <DateSelector role={Role} ID={ID} />
    </div>
}

export default Student