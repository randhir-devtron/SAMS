import '../App.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
function Login() {

    // const [role, setRole] = useState<string>('');
    const [formData, setFormData] = useState<{ username: string, password: string }>({
        username: '',
        password: ''
    })
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9000/login', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response from server');
            }

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Failed to parse JSON response from server');
            }

            if (Object.keys(data).length === 0) {
                throw new Error('Empty or malformed JSON response from server');
            }
            const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});

            const token = cookies.token;
            localStorage.setItem('token', token);
            console.log("data :", data);
            if (data.role == 'Student') {
                navigate("/student");
                return
            }
            else if (data.role == 'Teacher') {
                navigate("/teacher")
            }
            else if (data.role == 'Principal') {
                console.log('Login successful');
                navigate("/principal");
            }
            else {
                console.log("Enter correct credentials");
            }
        } catch (error) {
            // Handle network errors or other errors
            console.error('Error occurred:', (error as Error).message);
        }
    };



    const SetCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData({ ...formData, [name]: value });
    };
    return <div className='Login-Page'>
        <div className='Login'>
            <div className='Login-Left'>
                <div className='Login-Text'>
                    Nice to see you again
                </div>
                <div className='Login-Text'>
                    <h1>Welcome Back</h1>
                </div>
            </div>
        </div>
        <div className='Login'>
            <div className='Login-Right'>
                <div>This is My Login Page </div>
                <div className='Login-Form'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor={formData.username}>Username</label>
                        <input type="text" name="username" onChange={SetCredential} value={formData.username} />
                        <br />
                        <label htmlFor={formData.password}>Password</label>
                        <input type="text" name="password" onChange={SetCredential} value={formData.password} />
                        <br />
                        <input type="submit" onChange={SetCredential} value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    </div>
}

export default Login