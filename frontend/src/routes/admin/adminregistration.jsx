import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../form.css'
import LogoWhite from '../../components/shared/LogoWhite.jsx'
import mapsimage from '../../media/mapsimage.png'

import config from '../../features/config.js';

export default function AdminRegistration() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [errorMessage, setErrorMessage] = useState('error')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        },
    });


    const handleFirstNameChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            firstName: e.target.value,
        }));
    };

    const handleLastNameChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            lastName: e.target.value,
        }));
    };

    const handleEmailChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: e.target.value,
        }));
    };

    const handlePasswordChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: e.target.value,
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            confirmPassword: e.target.value,
        }));
    };

    useEffect(() => {
        setErrorMessage('');
        setResponse('')
    }, [formData])

    const validateForm = (formData) => {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            return {
                isValid: false,
                errorMessage: 'Enter valid name',
            };
        }

        if (formData.password !== formData.confirmPassword) {
            return {
                isValid: false,
                errorMessage: 'Passwords do not match!',
            };
        }

        return {
            isValid: true,
            errorMessage: 'error',
        }
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formValidation = validateForm(formData)

        if (!formValidation.isValid) {
            setErrorMessage(formValidation.errorMessage)
            setLoading(false)
        } else {
            setErrorMessage('');
            try {
                const response = await api.post(`${config.BASE_URL}/admin/signup`, {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
                console.log(response)
                if (response.status == 201) {
                    setResponse('Admin created. You may now login')
                }
            } catch (e) {
                if (e.response.status == 400) {
                    setErrorMessage("User with this email already exists")
                }
                else {
                    setErrorMessage("An error occured")
                }
            }
            setLoading(false)
        }
    };

    return (
        <main className="h-screen flex flex-row main max-w-full">
            {loading && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )}


            <div className='h-full bg-black flex-1 flex flex-col'>
                <LogoWhite />
                <div className='flex-grow relative object-center'>
                    <img src={mapsimage} alt="maps" className='h-4/5 w-auto absolute bottom-0 left-1/4' />
                </div>
            </div>

            <div className='h-full flex flex-col justify-center items-center bg-white w-2/5'>

                <h2 className="text-center text-2xl font-bold mb-10">Create admin account</h2>
                <form className=" w-2/3 flex flex-col gap-y-8" onSubmit={handleFormSubmission}>
                            <div>
                                <label htmlFor="firstName" className="text-gray-900 block">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    className="border-2 rounded-md p-1 block w-full"
                                    onChange={handleFirstNameChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="text-gray-900 block">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    className="border-2 rounded-md p-1 block w-full"
                                    onChange={handleLastNameChange}
                                />
                            </div>
                            <div className="inner-form-col flex flex-col gap-y-5">
                                <div className="">
                                    <label htmlFor="email" className="text-gray-900 block">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        className="border-2 rounded-md p-1 block w-full"
                                        onChange={handleEmailChange}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-gray-900 block">Password</label>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handlePasswordChange}
                                        className="border-2 rounded-md p-1 block w-full"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="confirmPassword" className="text-gray-900 block">Confirm Password</label>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className="border-2 rounded-md p-1 block w-full"
                                    />
                                </div>
                    </div>
                    {errorMessage &&
                        <p className="text-sm font-semibold text-red-600 w-full text-center">{errorMessage}</p>
                    }
                    {response &&
                        <p className="text-sm font-semibold text-indigo-600 w-full text-center">{response}</p>
                    }
                    <div>
                        <button type="submit" className=" w-full justify-center rounded-md bg-black py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-qp ">Sign up</button>
                    </div>

                </form>

            </div>
        </main>

    )

}