import LogoWhite from "../shared//LogoWhite"
import { UserCircle, MapPin, Home, SquareUser, History } from "lucide-react"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import config from "../../features/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { setCred } from "../../features/credSlice";

export default function OwnerSideBar() {
    const token = useSelector((state) => state.token)

    const navigate = useNavigate()

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [user, setUser] = useState({
        name: '',
        balance: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/profile`);
                console.log(response)
                setUser({
                    name: response.data.firstName + ' ' + response.data.lastName,
                    balance: response.data.balance
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchProfile();
    }, []);
    const dispatch = useDispatch()

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    function handleLogout() {
        dispatch(setCred({
            isLoggedIn: false,
            token: '',
            refreshToken: '',
        }))
        updateUser()
    }

    const updateUser = async () => {
        try {
            const response = await api.get(`/update`,)
            console.log("update user to customer response: ",response)
            navigate('/dashboard')
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="h-screen bg-qp flex flex-col gap-y-2">
            <LogoWhite />
            <div className="flex-grow flex flex-col text-white text-xl font-semibold pt-10">
                <Link to="" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <Home className="w-6 h-6" />
                    <p>Home</p>
                </Link>
                <Link to="profile" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <SquareUser className="w-6 h-6" />
                    <p>Profile</p>
                </Link>
                <Link to="parkinglocations" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <MapPin className="w-6 h-6" />
                    <p>Manage Parking</p>
                </Link>
                {/* <Link to="history" className="flex flex-row gap-x-2 hover:bg-white hover:text-qp cursor-pointer w-full h-16 items-center px-12">
                    <History className="w-6 h-6" />
                    <p>History</p>
                </Link> */}
            </div>

                <div className=" text-center text-black justify-center items-center">
                    <span className="bg-slate-200 border rounded-md shadow-md text-sm w-fit p-2">Blc: {user.balance}</span>
                </div>
            <div className="relative flex flex-row h-16 items-center gap-2 pl-10 text-white hover:bg-white active:bg-white hover:text-qp active:text-qp cursor-pointer" onClick={toggleDropdown}>
                <UserCircle className="w-10 h-10" />
                <span className="text-2xl">{user.name}</span>
                <span className="text-xl">(Owner)</span>
                {dropdownVisible && (
                    <div className="divide-y absolute left-0 bottom-16 w-52 bg-white border rounded-lg shadow-lg  text-black  flex flex-col">
                        <button className="px-4 py-2 text-left hover:bg-gray-200" onClick={handleLogout}>Logout</button>
                        <button className="px-4 py-2 text-left hover:bg-gray-200" onClick={updateUser}>Switch to User Mode</button>
                    </div >
                )}
            </div>
        </div>
    )
}