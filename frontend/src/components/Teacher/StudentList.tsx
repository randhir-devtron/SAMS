import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import '../../App.css'
import { ProgressBar } from 'react-loader-spinner';
interface Props {
    role: string
}
const url: string = "http://localhost:9000/students";
const StudentList: React.FC<Props> = ({ role }) => {

    const [loader, setLoader] = useState<boolean>(false);
    const [studentList, setStudentList] = useState<{
        ID: number;
        firstname: string;
        lastname: string;
        class: string;
    }[]>([]);

    const [studentNameStartWith, setStudentNameStartWith] = useState<string>("");
    const handleStudentStartName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentNameStartWith(() => e.target.value);
    }

    useEffect(() => {
        setLoader(false);
        const handleLoadData = async () => {

            let currentUrl = url + "/" + studentNameStartWith;

            if (studentNameStartWith == '') {
                currentUrl = url;
            }

            const response = await fetch(currentUrl, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const datas = await response.json()
                setStudentList(datas);
                setLoader(true);
                return
            }

            const errorData = "Data could not fetched from frontend : " + response.statusText;
            toast(errorData);
        }
        handleLoadData();
    }, [studentList.length, studentNameStartWith]);
    console.log("Role inside teacher : ", role);
    // if (role != 'Teacher') {
    //     return <>Error 404, Unauthorized</>
    // }


    return <>{<ProgressBar
        visible={loader}
        height="80"
        width="80"
        // color="#4fa94d"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
    /> && <div className="Home">

            <div className="home-header">

                <label htmlFor={studentNameStartWith}>Student : </label>
                <input className='search' type="text" placeholder='Search...' name="studentNameStartWith" onChange={handleStudentStartName} value={studentNameStartWith} />

            </div>
            <table className='table'>
                <colgroup>
                    <col span={3} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((data) => (
                        <tr className='listItem' key={data.ID}>
                            <td>{data.ID}</td>
                            <td>{data.firstname + " " + data.lastname}</td>
                            <td>{data.class}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>}
    </>
}

export default StudentList