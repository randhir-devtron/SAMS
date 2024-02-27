import React, { useState } from 'react'
import { Dispatch, SetStateAction } from "react";
// type Dispatcher<S> = Dispatch<SetStateAction<S>>;
import './teacher.css'

// interface params{
//     setStudentID: Dispatch<SetStateAction<number>>;
// }

const InputData = ({ setStudentID }: { setStudentID: Dispatch<SetStateAction<number>> }) => {
    const [inputId, setInputId] = useState(-1);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : -1;
        if (newValue != null) {
            setStudentID(newValue);
        }
        setInputId(newValue);
    };
    return (
        <div className='inputID'>
            {/* <label htmlFor={inputId}>ID :</label> */}
            <input type="number" value={(inputId <= -1) ? '' : inputId} onChange={handleInputChange} />
        </div>
    )
}

export default InputData