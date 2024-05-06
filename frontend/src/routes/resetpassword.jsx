import { useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from "axios";
import './form.css'

export default function ResetPassword() {

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })
    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState('')

    const navigate = useNavigate()

    const { uid, token } = useParams();

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

    const validateForm = (formData) => {
        if (formData.password !== formData.confirmPassword) {
            return {
                isValid: false,
                errorMessage: 'Passwords do not match!',
            };
        }

        return {
            isValid: true,
            errorMessage: ''
        }
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        const formValidation = validateForm(formData)

        if (!formValidation.isValid) {
            setErrorMessage(formValidation.errorMessage)
        }
        else {
            setErrorMessage('')
            const password = formData.password
            try {
                const response = await axios.put(`http://localhost:8000/reset/${uid}/${token}`, { password })
                setResponse(response.data)
            } catch (e) {
                setErrorMessage(e.response.data)
            }
        }
    }

    return (
        <main className="h-screen bg-gradient-to-r from-cyan-200 to-indigo-300 main">
            <div className="flex max-h-full flex-col justify-center bg-white w-96 md:max-w-50 m-auto rounded-lg form py-5">
                <div className="w-full mb-3">
                    <h2 className="text-center text-2xl font-bold text-indigo-600">Enter new password</h2>
                </div>
                <div className="w-full">
                    <form className="px-10" onSubmit={handleFormSubmission}>
                        <label htmlFor="password" className="text-gray-900 block">Password</label>
                        <div>
                            <input id="password" name="password" type="password" required value={formData.password}
                                className="border-2 rounded-md p-1 mb-4 block w-full"
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <label htmlFor="confirmPassword" className="text-gray-900 block">Confirm Password</label>
                        <div>
                            <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword}
                                className="border-2 rounded-md p-1 mb-4 block w-full"
                                onChange={handleConfirmPasswordChange}
                            />
                        </div>

                        {errorMessage &&
                            <p className="text-sm font-semibold text-red-600 w-full text-center">{errorMessage}</p>
                        }
                        
                        {response &&
                            <>
                                <p className="text-sm font-semibold text-gray-900 w-full text-center">{response}</p>
                                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-400">Click to Login</Link>
                            </>
                        }

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send Email</button>
                        </div>
                    </form>
                </div>
            </div>
        </main >
    )

}


// raxb wwyd gntu ykvi