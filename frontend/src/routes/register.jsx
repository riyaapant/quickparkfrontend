// import { ParkingCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './form.css'

export default function Register() {

    const [formData, setFormData] = useState({
        selectedRole: '',
        firstName: '',
        lastName: '',
        address: '',
        vehicleNumber: '',
        contactNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    // const [formData, setFormData] = useState({
    //     selectedRole: '',
    //     first_name: '',
    //     last_name: '',
    //     address: '',
    //     vehicle_number: '',
    //     contact_number: '',
    //     email: '',
    //     password: '',
    //     confirmPassword: '',
    // })

    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState('')

    const handleRoleClick = (role) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedRole: role,
        }));
    }

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

    const handleAddressChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            address: e.target.value,
        }));
    }

    const handleVehicleNumberChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            vehicleNumber: e.target.value,
        }));
    }

    const handleContactNumberChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            contactNumber: e.target.value,
        }));
    }

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
    }, [formData])

    const validateForm = (formData)=> {
        if (formData.selectedRole === '') {
            return {
                isValid: false,
                errorMessage: 'Select a role to register',
            };
        }
    
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            return {
                isValid: false,
                errorMessage: 'Enter valid name',
            };
        }
    
        if (!formData.address.trim()) {
            return {
                isValid: false,
                errorMessage: 'Enter valid address',
            };
        }
    
        if (formData.password !== formData.confirmPassword) {
            return {
                isValid: false,
                errorMessage: 'Passwords do not match!',
            };
        }
    
        if (!formData.vehicleNumber.trim()) {
            return {
                isValid: false,
                errorMessage: 'Enter valid vehicle number'
            }
        }
    
        return {
            isValid: true,
            errorMessage: ''
        }
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();

        const formValidation = validateForm(formData)
        
        if(!formValidation.isValid){
            setErrorMessage(formValidation.errorMessage)
        }else {
            setErrorMessage('');
            try {
                const response = await axios.post(`http://localhost:8000/${formData.selectedRole}/signup`, {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    contact: formData.contactNumber,
                    address: formData.address,
                    vehicle_id: formData.vehicleNumber
                })
                setResponse(response.data)
                // console.log("reponse: ", response.data)
            } catch (e) {
                console.log(e)
            }
        }
    };

    return (
        <main className="h-screen bg-gradient-to-r from-cyan-200 to-indigo-300 main max-w-full">
            <div className="flex flex-col gap-y-5 justify-center bg-white m-auto rounded-lg form py-5">
                <div className="">
                    <h2 className="text-center text-2xl font-bold text-gray-900">Create an Account</h2>
                </div>
                <form className="px-10 flex flex-col gap-y-5" onSubmit={handleFormSubmission}>
                    <div className="flex justify-between gap-5">
                        <button
                            className={`w-full text-lg rounded-md p-2 ${formData.selectedRole === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                            onClick={() => handleRoleClick('user')}
                        >
                            User
                        </button>
                        <button
                            className={`w-full text-lg rounded-md p-2 ${formData.selectedRole === 'owner' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                            onClick={() => handleRoleClick('owner')}
                        >
                            Owner
                        </button>
                    </div>
                    <div className="outer-form flex flex-row justify-between gap-10">
                        <div className="inner-form-col flex flex-col gap-y-2">
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

                            <div>
                                <label htmlFor="address" className="text-gray-900 block">Address</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    className="border-2 rounded-md p-1 block w-full"
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_number" className="text-gray-900 block">Contact Number</label>
                                <input
                                    id="contact_number"
                                    name="contact_number"
                                    type="tel" maxLength={10} minLength={10}
                                    required
                                    value={formData.contact_number}
                                    className="border-2 rounded-md p-1 block w-full"
                                    onChange={handleContactNumberChange}
                                />
                            </div>
                            {formData.selectedRole === 'user' && (
                                <div>
                                    <label htmlFor="vehicle_number" className="text-gray-900 block">Vehicle-Number</label>
                                    <input
                                        id="vehicle_number"
                                        name="vehicle_number"
                                        type="text"
                                        required
                                        value={formData.vehicle_number}
                                        className="border-2 rounded-md p-1 block w-full"
                                        onChange={handleVehicleNumberChange}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="inner-form-col flex flex-col gap-y-2">
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
                    </div>
                    {errorMessage &&
                        <p className="text-sm font-semibold text-red-600 w-full text-center">{errorMessage}</p>
                    }
                    {response &&
                        <p className="text-sm font-semibold text-indigo-600 w-full text-center">{response}</p>
                    }
                    <div>
                        <button type="submit" className=" w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>

                </form>
                <p className="text-center text-sm text-gray-500">
                    Already have an account?
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-400">Login</Link>
                </p>
            </div>
        </main>
    )

}