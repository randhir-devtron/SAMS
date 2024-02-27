import { useEffect, useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import './CalendarStudent.css'

interface Props {
    ChoosenMonth: number,
    ChoosenYear: number,
    ID: number,
    role: string
}


const CalendarStudent: React.FC<Props> = ({ ChoosenMonth, ChoosenYear, ID, role }) => {
    const [selectedDays, setSelectedDays] = useState<{ day: number, month: number, year: number }[]>([]);

    useEffect(() => {
        const GetAttendanceDates = async () => {
            console.log("ChooseMonth : ", ChoosenMonth + ", ChooseYear : ", ChoosenYear);
            if (ChoosenMonth != -1 && ChoosenYear != -1) {
                const url = "http://localhost:9000/student" + "/" + ID + "/" + ChoosenMonth + "/" + ChoosenYear;
                const response = await fetch(url, {
                    method: 'GET'
                })
                const PresentDays = await response.json();
                console.log("PresentDays : ", PresentDays);
                // let month: number;
                // let year: number;

                const data = PresentDays.map((PresentDay: { day: number }) => ({
                    day: PresentDay.day, month: ChoosenMonth, year: ChoosenYear
                }))
                setSelectedDays(data);
            }
        }
        GetAttendanceDates();
    }, [ChoosenMonth, ChoosenYear, ID, role]);

    const handleChange = (newSelectedDays: { day: number, month: number, year: number }[]) => {
        console.log(newSelectedDays);
        setSelectedDays(newSelectedDays);
    }

    return (
        <Calendar
            calendarClassName="calendar-student"
            value={selectedDays}
            onChange={handleChange}
            shouldHighlightWeekends
        />

    );
};

export default CalendarStudent;