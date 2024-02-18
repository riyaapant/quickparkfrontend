// import { ParkingCircle } from "lucide-react";
import { ChangeEvent, FormEvent, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import './form.css'

export default function Register() {

    const [selectedRole, setSelectedRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleRoleClick(role: SetStateAction<string>) {
        setSelectedRole(role)
    }

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleFormSubmission = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(name)
        console.log(email)
        console.log(password)
        console.log(selectedRole)
    };

    return (
        <main className="h-screen bg-gradient-to-r from-cyan-200 to-indigo-300 main">
        <div className="flex max-h-full flex-col justify-center bg-white w-96 md:max-w-50 m-auto rounded-lg form py-5">
            <div className="w-full mb-3">
            {/* <ParkingCircle size={50} className="mx-auto text-gray-900" /> */}
                <h2 className="text-center text-2xl font-bold text-gray-900">Create an Account</h2>
            </div>
            <div className="w-full">
                <form className="px-10" onSubmit={handleFormSubmission}>
                <div className="flex justify-between gap-2 mb-3">
                            <button
                                className={`w-full text-lg rounded-md p-2 ${selectedRole === 'User' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                                onClick={() => handleRoleClick('User')}
                            >
                                User
                            </button>
                            <button
                                className={`w-full text-lg rounded-md p-2 ${selectedRole === 'Owner' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                                onClick={() => handleRoleClick('Owner')}
                            >
                                Owner
                            </button>
                        </div>
                    <div className="mt-5">
                        <label htmlFor="name" className="text-gray-900 block">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            className="border-2 rounded-md p-1 mt-2 block w-full"
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="mt-5">
                        <label htmlFor="email" className="text-gray-900 block">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            className="border-2 rounded-md p-1 mt-2 block w-full"
                            onChange={handleEmailChange}
                        />
                    </div>

                    <div className="mt-5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-gray-900 block">Password</label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            className="border-2 rounded-md p-1 block w-full"
                        />
                    </div>

                    <div className="my-5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="confirmPassword" className="text-gray-900 block">Confirm Password</label>
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="border-2 rounded-md p-1 mt-2 block w-full"
                        />
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-500 mt-3">
                    Already have an account?
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-400">Login</Link>
                </p>
            </div>
        </div>
    </main>
    )

}