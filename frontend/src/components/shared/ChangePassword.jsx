import axios from "axios"
import { useState } from "react"
import config from "../../features/config"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function ChangePassword() {

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState('')
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const handleOldPasswordChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            oldPassword: e.target.value,
        }));
    };

    const handleNewPasswordChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            newPassword: e.target.value,
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            confirmPassword: e.target.value,
        }));
    };

    const validateForm = (formData) => {
        if (formData.newPassword !== formData.confirmPassword) {
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

    function goBack(){
        navigate(-1)
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        const formValidation = validateForm(formData)

        if (!formValidation.isValid) {
            setErrorMessage(formValidation.errorMessage)
        }
        else {
            setErrorMessage('')
            const old_password = formData.oldPassword
            const new_password = formData.newPassword
            try {
                const response = await api.put(`${config.BASE_URL}/changepassword`, { old_password, new_password })
                setResponse(response.data)
                setSuccess(true)
            } catch (e) {
                setErrorMessage(e.response.data)
            }
        }
    }

    return (
        <>
            {
                success ? (
                    <div className="h-screen p-20 flex flex-col w-2/3 justify-center items-center gap-y-3" >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>
                        <p className="text-lg">{response}</p>
                        <div>
                            <button type="submit" className="px-5 justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500" onClick={goBack}>Continue</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center border w-96 rounded-lg form py-5 gap-y-3">

                        <div className="w-full mb-3">
                            <h2 className="text-center text-2xl font-bold text-gray-900">Change Password</h2>
                        </div>
                        <div className="w-full">
                            <form className="px-10" onSubmit={handleFormSubmission}>
                                <label htmlFor="password" className="text-gray-900 block">Enter Old Password</label>
                                <div>
                                    <input id="password" name="password" type="password" required value={formData.password}
                                        className="border-2 rounded-md p-1 mb-4 block w-full"
                                        onChange={handleOldPasswordChange}
                                    />
                                </div>
                                <label htmlFor="password" className="text-gray-900 block">Enter New Password</label>
                                <div>
                                    <input id="password" name="password" type="password" required value={formData.password}
                                        className="border-2 rounded-md p-1 mb-4 block w-full"
                                        onChange={handleNewPasswordChange}
                                    />
                                </div>
                                <label htmlFor="confirmPassword" className="text-gray-900 block">Confirm New Password</label>
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
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm font-semibold text-gray-900 w-full text-center">{response}</p>
                                    </div>
                                }

                                <div>
                                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Change Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>

    )
}

