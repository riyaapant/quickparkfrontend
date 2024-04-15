// import { ParkingCircle } from "lucide-react";
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';

import {
    validateRole,
    validateName,
    validateAddress,
    validatePasswordMatch,
    FormValidationResult,
    validateVehicleNumber,
} from './formValidation';
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

    const [errorMessage, setErrorMessage] = useState('')

    const handleRoleClick = (role: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedRole: role,
        }));
    }

    const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            firstName: e.target.value,
        }));
    };

    const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            lastName: e.target.value,
        }));
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            address: e.target.value,
        }));
    }

    const handleVehicleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            vehicleNumber: e.target.value,
        }));
    }

    const handleContactNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            contactNumber: e.target.value,
        }));
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            email: e.target.value,
        }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: e.target.value,
        }));
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            confirmPassword: e.target.value,
        }));
    };

    useEffect(() => {
        setErrorMessage('');
    }, [formData])

    const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const roleValidation: FormValidationResult = validateRole(formData.selectedRole);
        const nameValidation: FormValidationResult = validateName(formData.firstName, formData.lastName);
        const addressValidation: FormValidationResult = validateAddress(formData.address);
        const passwordMatchValidation: FormValidationResult = validatePasswordMatch(formData.password, formData.confirmPassword);
        const vehicleNumberValidation: FormValidationResult = validateVehicleNumber(formData.vehicleNumber);

        if (!roleValidation.isValid) {
            setErrorMessage(roleValidation.errorMessage);
        } else if (!nameValidation.isValid) {
            setErrorMessage(nameValidation.errorMessage);
        } else if (!addressValidation.isValid) {
            setErrorMessage(addressValidation.errorMessage);
        } else if (!passwordMatchValidation.isValid) {
            setErrorMessage(passwordMatchValidation.errorMessage);
        } else if (!vehicleNumberValidation.isValid) {
            setErrorMessage(vehicleNumberValidation.errorMessage)
        } else {
            setErrorMessage('');
            try {
                // console.log(formData.selectedRole)
                const response = await axios.post(`http://localhost:8000/${formData.selectedRole}/signup`, formData)
                console.log("reponse: ", response.data)
            } catch(e) {
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
                                <label htmlFor="contactNumber" className="text-gray-900 block">Contact Number</label>
                                <input
                                    id="contactNumber"
                                    name="contactNumber"
                                    type="tel" maxLength={10} minLength={10}
                                    required
                                    value={formData.contactNumber}
                                    className="border-2 rounded-md p-1 block w-full"
                                    onChange={handleContactNumberChange}
                                />
                            </div>
                            {formData.selectedRole === 'user' && (
                                <div>
                                    <label htmlFor="vehicleNumber" className="text-gray-900 block">Vehicle-Number</label>
                                    <input
                                        id="vehicleNumber"
                                        name="vehicleNumber"
                                        type="text"
                                        required
                                        value={formData.vehicleNumber}
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