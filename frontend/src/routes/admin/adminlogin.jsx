import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setCred } from "../../features/credSlice.js";
import config from "../../features/config.js";

import '../form.css'
import LogoWhite from '../../components/shared/LogoWhite.jsx'
import mapsimage from '../../media/mapsimage.png'



export default function AdminLogin() {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const api = axios.create({
        baseURL: config.BASE_URL,
    });


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errorMessage, setErrorMessage] = useState('')

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
        try {
            const response = await api.post(`/admin/login`, formData)
            if (response.status == 202) {
                dispatch(setCred({
                    isLoggedIn: true,
                    token: response.data.access,
                    refreshToken: response.data.refresh
                }))
            }
            navigate(`/admin/dashboard`)
        }
        catch (e) {
            setErrorMessage(e.response.data)
        }
    }

    useEffect(() => {
        setErrorMessage('');
    }, [formData])

    return (
        <main className="h-screen flex flex-row main max-w-full">
            <div className='h-full bg-black flex-1 flex flex-col'>
                <LogoWhite />
                <div className='flex-grow relative object-center'>
                    <img src={mapsimage} alt="maps" className='h-4/5 w-auto absolute bottom-0 left-1/4' />
                </div>
            </div>
            <div className='h-full flex justify-center items-center bg-white w-2/5'>
                <div className=" w-full max-w-md"> {/* Adjusted max-w-md */}
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">Login to your account</h2>
                    <form className="flex flex-col gap-y-5 w-full" onSubmit={handleFormSubmission}>

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
                            <button type="submit" className="flex w-full justify-center rounded-md bg-black py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-qp">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>

    )

}
