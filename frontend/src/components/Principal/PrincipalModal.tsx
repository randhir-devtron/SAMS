import React, { Dispatch, SetStateAction } from 'react'
import Select, { SingleValue, ActionMeta } from 'react-select';
import { useState } from "react";
import '../../App.css'
import './principal.css'

interface Props {
    SetModalFlag: Dispatch<boolean>;
    setTeacherList: Dispatch<SetStateAction<{
        ID: number;
        firstname: string;
        lastname: string;
        qualification: string;
    }[]>>
}

const PrincipalModal: React.FC<Props> = ({ SetModalFlag, setTeacherList }) => {

    interface option {
        value: string;
        label: string;
    }



    const [userFormData, setUserFormData] = useState<{ firstname: string, lastname: string, email: string, qualification?: string, class?: number }>({
        firstname: '',
        lastname: '',
        email: '',
        class: 0,
        qualification: ''
    })

    const [user, setUser] = useState("");

    const person: option[] = [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' }
    ]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        interface StudentData {
            firstname: string;
            lastname: string;
            email: string;
            qualification?: string;
            class?: number;
        }
        console.log("Hey there");
        const studentData: StudentData = {
            firstname: userFormData.firstname,
            lastname: userFormData.lastname,
            email: userFormData.email
        }
        if (user == 'student') {
            studentData['class'] = userFormData.class;
        }
        else {
            studentData['qualification'] = userFormData.qualification;
        }
        try {
            if (user != 'student' && user != 'teacher') {
                throw new Error('Choose student or teacher');
            }

            const url = `http://localhost:9000/${user}`;

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            // Reset the teacher list
            setTeacherList([] as {
                ID: number;
                firstname: string;
                lastname: string;
                qualification: string;
            }[]);


        } catch (error) {
            console.error('Error occurred:', (error as Error).message);
        }

        handleClose();
    };

    const SetCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'class' && parseInt(value) <= 0) {
            console.log('Class value must be greater than 0');
            return;
        }

        setUserFormData({ ...userFormData, [name]: value });
    };

    function handleClose() {
        SetModalFlag(false);
    }

    const handleChange = (newValue: SingleValue<option>, actionMeta: ActionMeta<option>) => {
        if (newValue !== null) {
            setUser(newValue.value);
        }
        if (actionMeta !== null) {
            console.log(actionMeta)
        }
    };

    const elementQualification = document.getElementsByClassName('qualificationHide')[0] as HTMLElement;
    const elementClass = document.getElementsByClassName('classHide')[0] as HTMLElement;

    if (user == 'student') {
        elementQualification.style.display = 'none';
        elementClass.style.display = 'block';
    }

    else if (user == 'teacher') {
        elementClass.style.display = 'none';
        elementQualification.style.display = 'block';
    }

    return (
        <div className="principal-modal">
            <span className="close" onClick={handleClose}>&times;</span>
            <h2>Add Role</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor={userFormData.firstname}>First Name : </label>
                <input type="text" name="firstname" onChange={SetCredential} value={userFormData.firstname} />
                <br />
                <label htmlFor={userFormData.lastname}>Last Name : </label>
                <input type="text" name="lastname" onChange={SetCredential} value={userFormData.lastname} />
                <br />
                <label htmlFor={userFormData.email}>Email : </label>
                <input type="email" name="email" onChange={SetCredential} value={userFormData.email} />
                <br />
                <div className="qualificationHide">
                    <label htmlFor={userFormData.qualification}>Qualification : </label>
                    <input type="text" name="qualification" onChange={SetCredential} value={userFormData.qualification} />
                    <br />
                </div>

                <div className="classHide">
                    <label htmlFor={String(userFormData.class)}>Class : </label>
                    <input type="number" name="class" onChange={SetCredential} value={userFormData.class} />
                    <br />
                </div>
                <input type="submit" onChange={SetCredential} value="Submit" />
                <label htmlFor="person">Person : </label>

                <Select options={person} onChange={handleChange} />
            </form>
        </div>
    )
}

export default PrincipalModal