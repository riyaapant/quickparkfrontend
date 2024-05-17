import LogoWhite from "./LogoWhite"
import { UserCircle, MapPin, Home, SquareUser } from "lucide-react"
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

import { setCred } from "../features/credSlice";

export default function SideBar() {
    const dispatch = useDispatch()

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    function handleLogout() {
        dispatch(setCred({
            isLoggedIn: false,
            accessToken: '',
            refreshToken: '',
            role: null
        }))
    }

    return (
        <div className="h-screen bg-qp flex flex-col gap-y-2">
            <LogoWhite />

            <div className="flex-grow flex flex-col text-white text-xl font-semibold pt-10">
                <Link to="#" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <Home className="w-6 h-6"/>
                    <p>Home</p>
                </Link>
                <Link to="profile" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <SquareUser className="w-6 h-6"/>
                    <p>Profile</p>
                </Link>
                <Link to="maps" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <MapPin className="w-6 h-6"/>
                    <p>Map</p>
                </Link>
            </div>

            <div className="relative flex flex-row h-16 items-center gap-2 pl-10 text-white hover:bg-white active:bg-white hover:text-qp active:text-qp cursor-pointer" onClick={toggleDropdown}>
                <UserCircle className="w-10 h-10" />
                <span className="text-2xl">John Doe</span>
                {dropdownVisible && (
                    <button className="absolute left-0 bottom-16 w-48 bg-white border rounded-lg shadow-lg px-4 py-2 text-left text-black hover:bg-gray-200" onClick={handleLogout}>Logout</button>
                )}
            </div>
        </div>
    )
}