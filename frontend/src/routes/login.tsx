// import { ParkingCircle } from "lucide-react"; // Remove this import if unused
import { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import './form.css'

export default function Login() {

    
    const { auth, setAuth } = useContext(AuthContext);
    
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        selectedRole: 'user',
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('')

    const handleRoleClick = (role: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedRole: role,
        }));
    }
    function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: e.target.value,
        }))
    }

    function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: e.target.value,
        }))
    }

    const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/${formData.selectedRole}/login`, formData)
            if (response.status == 202) {
                const auth = await axios.post(`http://localhost:8000/api/token/`, formData)
                // console.log(auth)
                // const loginData = { role: formData.selectedRole, token: auth.data.access, refreshToken: auth.data.refresh };
                const role = formData.selectedRole;
                const token = auth.data.access;
                const refreshToken = auth.data.refresh;
                const isLoggedIn = true
                setAuth({ role, token, refreshToken, isLoggedIn });
                // console.log(loginData)
                navigate(`/profile`) 
            }
        } catch (e) {
            setErrorMessage(e.response.data)
        }
    }

    useEffect(() => {
        console.log(auth)
        },[auth])

    useEffect(() => {
        setErrorMessage('');
    }, [formData])

    return (
        <main className="h-screen bg-gradient-to-r from-cyan-200 to-indigo-300 main">
            <div className="flex max-h-full flex-col justify-center bg-white w-96 md:max-w-50 m-auto rounded-lg form py-5">
                <div className="w-full mb-3">
                    <h2 className="text-center text-2xl font-bold text-gray-900">Login</h2>
                </div>
                <div className="w-full">
                    <form className="px-10" onSubmit={handleFormSubmission}>
                        <div className="flex justify-between gap-2 mb-3">
                            <button
                                className={`w-full text-lg rounded-md p-2 focus:outline-none ${formData.selectedRole === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                                onClick={() => handleRoleClick('user')}
                            >
                                User
                            </button>
                            <button
                                className={`w-full text-lg rounded-md p-2 focus:outline-none ${formData.selectedRole === 'owner' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                                onClick={() => handleRoleClick('owner')}
                            >
                                Owner
                            </button>
                            <button
                                className={`w-full text-lg rounded-md p-2 focus:outline-none ${formData.selectedRole === 'admin' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                                onClick={() => handleRoleClick('admin')}
                            >
                                Admin
                            </button>
                        </div>

                        <div>
                            <label htmlFor="email" className="text-gray-900 block">Email Address</label>
                            <input id="email" name="email" type="email" required value={formData.email}
                                className="border-2 rounded-md p-1 mt-2 block w-full"
                                onChange={handleEmailChange}
                            />
                        </div>

                        <div className="my-5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-gray-900 block">Password</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-400">Forgot password?</a>
                                </div>
                            </div>
                            <input id="password" name="password" type="password" required value={formData.password}
                                onChange={handlePasswordChange}
                                className="border-2 rounded-md p-1 mt-2 block w-full"
                            />
                        </div>
                        {errorMessage &&
                            <p className="text-sm font-semibold text-red-600 w-full text-center">{errorMessage}</p>
                        }
                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-3">
                        Don't have an account?
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-400">Sign Up</Link>
                    </p>
                </div>
            </div>
        </main >
    )

}
