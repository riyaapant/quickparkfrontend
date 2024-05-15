import { UserCircle } from 'lucide-react'
import logowhite from '../media/logowhite.png'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { setCred } from "../features/credSlice";


export default function Dashboard() {

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const dispatch = useDispatch()

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const role = useSelector((state) => state.role)
    const refreshToken = useSelector((state) => state.refreshToken)
    const accessToken = useSelector((state) => state.token)

    const navigate = useNavigate();

    useEffect(() => {
        console.log("isLoggedIn: ", isLoggedIn)
        console.log("Role: ", role)
        console.log("Refresh Token: ", refreshToken)
        console.log("Access Token: ", accessToken)
        if (!isLoggedIn) {
            navigate('/login')
        }
    });

    function handleLogout() {
        dispatch(setCred({
            isLoggedIn: false,
            token: '',
            refreshToken: '',
            role: null
        }))
    }

    return (
        <main className="h-screen flex flex-row bg-white">
            <div className="h-screen w-1/5 bg-qp flex flex-col gap-y-2">
                <div className="flex-none h-20">
                    <img src={logowhite} alt="img" className='h-20 w-auto' />
                </div>
                <div className="flex-grow"></div>
                <div className="relative flex flex-row h-16 items-center gap-2 pl-4 text-white hover:bg-white active:bg-white hover:text-qp active:text-qp cursor-pointer" onClick={toggleDropdown}>
                    <UserCircle className="w-10 h-10" />
                    <span className="text-2xl">John Doe</span>
                    {dropdownVisible && (
                        <button className="absolute left-0 bottom-16 w-48 bg-white border rounded-lg shadow-lg px-4 py-2 text-left text-black hover:bg-gray-200" onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </div>
            <div className="h-screen w-2/5 p-20 flex flex-col">
                <section className='h-auto'>
                    <p className='text-2xl font-bold'>Let's get you verified</p>
                    <p className='text-lg'>We will manually verify these documents to list you as a parking land owner</p>
                </section>

                <section className='flex-grow justify-center pt-10'>
                    <form className='flex flex-col gap-y-8'>
                        <div>
                            <label htmlFor="land-registration-document">Upload your land registration papers</label>
                            <input
                                type='file'
                                id="land-registration-document"
                                name="firstName"
                                required
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="tax-document">Upload your land tax papers</label>
                            <input
                                type='file'
                                id="tax-document"
                                name="firstName"
                                required
                                className="w-full"
                            />
                        </div>
                    </form>
                </section>

                <section className='h-auto'>
                    <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
                </section>
            </div>
        </main>
    )
}