import Select, { SingleValue, ActionMeta } from 'react-select';
import CalendarStudent from './CalendarStudent';
import { useState } from 'react';
const DateSelector: React.FC<{ role: string, ID: number }> = ({ role, ID }) => {
    const Role: string = role;
    interface option {
        value: number;
        label: number;
    }
    const UNSELECTED = -1;
    interface chooseYearMonth {
        ChooseYear: number;
        ChooseMonth: number;
    }
    const [chooseYearMonth, setChooseYearMonth] = useState<chooseYearMonth>({
        ChooseMonth: UNSELECTED,
        ChooseYear: UNSELECTED
    });

    const month: option[] = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: 6 },
        { value: 7, label: 7 },
        { value: 8, label: 8 },
        { value: 9, label: 9 },
        { value: 10, label: 10 },
        { value: 11, label: 11 },
        { value: 12, label: 12 }
    ]
    const year: option[] = [
        { value: 2022, label: 2022 },
        { value: 2023, label: 2023 },
        { value: 2024, label: 2024 },
        { value: 2025, label: 2025 },
        { value: 2026, label: 2026 },
        { value: 2027, label: 2027 }
    ]
    const HandleYearChange = (newValue: SingleValue<option>, actionMeta: ActionMeta<option>) => {
        if (newValue !== null) {
            setChooseYearMonth(prevState => ({
                ...prevState,
                ChooseYear: newValue.value

            }))
        }
        if (actionMeta !== null) {
            console.log(actionMeta)
        }
    };
    const HandleMonthChange = (newValue: SingleValue<option>, actionMeta: ActionMeta<option>) => {
        if (newValue !== null) {
            setChooseYearMonth(prevState => ({
                ...prevState,
                ChooseMonth: newValue.value

            }))
        }
        if (actionMeta !== null) {
            console.log(actionMeta)
        }
    };

    return (
        <>
            <div className='student-home'>
                <div className="student-home-select">
                    <label htmlFor="month">Month : </label>
                    <Select options={month} onChange={HandleMonthChange} />
                </div>
                <div className="student-home-select">
                    <label htmlFor="year">year : </label>
                    <Select options={year} onChange={HandleYearChange} />
                </div>
            </div>
            <div className="calendar-student">
                <CalendarStudent ChoosenMonth={chooseYearMonth.ChooseMonth} ChoosenYear={chooseYearMonth.ChooseYear} ID={ID} role={Role} />
            </div>
        </>
    )
}

export default DateSelector