import { useState, useEffect } from "react";
import axios from "axios";
import '../form.css'

import config from "../../features/config.js";

import LogoWhite from '../../components/shared/LogoWhite.jsx'

export default function ForgotPassword() {

    const [email, setEmail] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
          'Content-Type': 'application/json'
        },
      });

    function handleEmailChange(e) {
        setEmail(e.target.value)
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        setLoading(true)
        console.log(email)
        try {
            const response = await api.post(`${config.BASE_URL}/forgetpassword`, { email });
            setResponse(response.data)
            console.log(response)
            setLoading(false)
        } catch (e) {
            setErrorMessage(e.response.data)
            setLoading(false)
        }
    }

    useEffect(() => {
        setErrorMessage('');
    }, [email])

    return (
        <main className="h-screen bg-qp main flex flex-col">
            {loading && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )}
            <LogoWhite />
            <div className="flex max-h-full flex-col justify-center bg-white w-96 md:max-w-50 m-auto rounded-lg form py-5">
                <div className="w-full mb-3">
                    <h2 className="text-center text-2xl font-bold text-gray-900">Forgot your password?</h2>
                </div>
                <div className="w-full mb-3">
                    <h4 className="text-center text-sm font-semibold text-gray-700 mx-5">Enter your registered email address and we'll send you a password reset link</h4>
                </div>
                <div className="w-full">
                    <form className="px-10" onSubmit={handleFormSubmission}>

                        <div>
                            <input id="email" name="email" type="email" required value={email}
                                className="border-2 rounded-md p-1 mb-4 block w-full"
                                onChange={handleEmailChange}
                            />
                        </div>

                        {errorMessage &&
                            <p className="text-sm font-semibold text-red-600 w-full text-center">{errorMessage}</p>
                        }
                        {response &&
                            <p className="text-sm font-semibold text-indigo-600 w-full text-center">{response}</p>
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
