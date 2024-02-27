import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    name: string;
    ID: number | null;
    role: string;
    email: string;
}

const NavBar: React.FC<Props> = ({ name, ID, role, email }): JSX.Element => {
    const setPunchInUrl = async () => {
        try {
            const url = "http://localhost:9000/punchin" + role.toLowerCase() + "/" + ID;
            console.log("Url : ", url);
            const response = await fetch(url, {
                method: "POST",
            })
            console.log("OK : ", response.ok);
            console.log("Status : ", response.status);
            if (!response.ok) {
                if (response.status == 400) {
                    toast("Can not Punched In before punching out");
                    return;
                }
                toast("Some error while Punched In");
            }
            toast("Successfully Punched In");
        } catch (error) {
            toast("Can not Punched In");
        }
    }

    const setPunchOutUrl = async () => {
        try {
            const url = "http://localhost:9000/punchout" + role.toLowerCase() + "/" + ID;
            const response = await fetch(url, {
                method: "POST",
            })
            if (!response.ok) {
                if (response.status == 400) {
                    toast("Can not Punched out before punching in");
                    return;
                }
                toast("Some error while Punching out");
            }
            console.log(role)
            console.log(response.status)
            toast("Successfully Punched Out");
        } catch (error) {
            toast("Can not Punched Out");
        }

    }

    return (
        <>
            <div className="student-navbar">
                <div className="student-navbar-img">
                    <img src="../../../public/Randhir.jpeg" alt="Image" className="randhir-image" />
                </div>
                <div className="student-navbar-information">

                    <h3>{name}</h3>
                    <h5>{email}</h5>
                </div>
                <div className="student-navbar-button">
                    <button type='button' onClick={setPunchInUrl}>Punch In</button>
                    <button type='button' onClick={setPunchOutUrl}>Punch Out</button>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default NavBar   