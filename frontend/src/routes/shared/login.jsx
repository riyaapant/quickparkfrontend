import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCred } from "../../features/credSlice.js";
import '../form.css'
import LogoWhite from '../../components/shared/LogoWhite.jsx'
// import logowhite from '../media/logowhite.png'
import mapsimage from '../../media/mapsimage.png'


export default function Login() {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const location = useSelector((state) => state.userLocation)

    useEffect(() => {
        console.log(location)
        if (isLoggedIn) {
            navigate('/dashboard')
        }
    }, [isLoggedIn])

    const [formData, setFormData] = useState({
        selectedRole: '',
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('')

    const handleRoleClick = (role) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedRole: role,
        }));
    }
    function handleEmailChange(e) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: e.target.value,
        }))
    }

    function handlePasswordChange(e) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: e.target.value,
        }))
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        if (formData.selectedRole === '') {
            setErrorMessage("Select a role to continue login")
            return;
        }
        try {
            const response = await axios.post(`http://110.44.121.73:2564/${formData.selectedRole}/login`, formData)
            // const response = await axios.post(`http://localhost:8000/${formData.selectedRole}/login`, formData)
            if (response.status == 202) {
                const auth = await axios.post(`http://110.44.121.73:2564/api/token`, formData)
                dispatch(setCred({
                    isLoggedIn: true,
                    token: auth.data.access,
                    refreshToken: auth.data.refresh,
                    role: formData.selectedRole
                }))
                navigate(`/dashboard`)
            }
        } catch (e) {
            setErrorMessage(e.response.data)
        }
    }

    useEffect(() => {
        setErrorMessage('');
    }, [formData])

    return (
        <main className="h-screen flex flex-row main max-w-full">
            <div className='h-full bg-qp flex-1 flex flex-col'>
                <LogoWhite />
                <div className='flex-grow relative object-center'>
                    <img src={mapsimage} alt="maps" className='h-4/5 w-auto absolute bottom-0 left-1/4' />
                </div>
            </div>
            <div className='h-full flex justify-center items-center bg-white w-2/5'>
                <div className=" w-full max-w-md"> {/* Adjusted max-w-md */}
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">Login to your account</h2>
                    <form className="flex flex-col gap-y-5 w-full" onSubmit={handleFormSubmission}>
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
                                    <Link to="/forgotpassword" className="font-semibold text-indigo-600 hover:text-indigo-400">Forgot Password?</Link>
                                    {/* <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-400">Forgot password?</a> */}
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
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-400"> Sign Up</Link>
                    </p>
                </div>
            </div>
        </main>

    )

}
