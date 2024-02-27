import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import PrincipalModal from './PrincipalModal'
import '../../App.css'
import url from './Utils.tsx'
// interface Props {
//     role: string
// }
const Home: React.FC = () => {
    const [modalFlag, SetModalFlag] = useState(false);

    function handleClick() {
        SetModalFlag(true);
    }

    const [teacherList, setTeacherList] = useState<{
        ID: number;
        firstname: string;
        lastname: string;
        qualification: string;
    }[]>([]);

    const [teacherNameStartWith, setTeacherNameStartWith] = useState<string>("");
    const handleTeacherStartName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTeacherNameStartWith(() => e.target.value);
    }

    useEffect(() => {
        const handleLoadData = async () => {

            let currentUrl = url + "/" + teacherNameStartWith;

            if (teacherNameStartWith == '') {
                currentUrl = url;
            }

            const response = await fetch(currentUrl, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const datas = await response.json()
                setTeacherList(datas);
                return
            }

            const errorData = "Data could not fetched from frontend : " + response.statusText;
            toast(errorData);
        }
        handleLoadData();
    }, [teacherList.length, teacherNameStartWith]);



    return <div className="Home">

        <div className="home-header">

            <label htmlFor={teacherNameStartWith}>Teacher : </label>
            <input className='search' type="text" placeholder='Search...' name="teacherNameStartWith" onChange={handleTeacherStartName} value={teacherNameStartWith} />

            <button className='modal-button' onClick={handleClick}>Add Role</button>
        </div>

        {modalFlag && <PrincipalModal SetModalFlag={SetModalFlag} setTeacherList={setTeacherList} />}

        <table className='table'>
            <colgroup>
                <col span={3} />
            </colgroup>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Qualification</th>
                </tr>
            </thead>
            <tbody>
                {teacherList.map((data) => (
                    <tr className='listItem' key={data.ID}>
                        <td>{data.ID}</td>
                        <td>{data.firstname + " " + data.lastname}</td>
                        <td>{data.qualification}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ToastContainer />
    </div>
}

export default Home