import { useState, useEffect } from "react";
import axios from "axios";
import './form.css'
export default function ForgotPassword() {

    const [email, setEmail] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [response, setResponse] = useState('')

    function handleEmailChange(e) {
        setEmail(e.target.value)
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        console.log(email)
        try {
            const response = await axios.post('http://localhost:8000/forgetpassword', { email });
            setResponse(response.data)
            console.log(response)
        } catch (e) {
            setErrorMessage(e.response.data)
        }
    }

    useEffect(() => {
        setErrorMessage('');
    }, [email])

    return (
        <main className="h-screen bg-gradient-to-r from-cyan-200 to-indigo-300 main">
            <div className="flex max-h-full flex-col justify-center bg-white w-96 md:max-w-50 m-auto rounded-lg form py-5">
                <div className="w-full mb-3">
                    <h2 className="text-center text-2xl font-bold text-indigo-600">Forgot your password?</h2>
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
