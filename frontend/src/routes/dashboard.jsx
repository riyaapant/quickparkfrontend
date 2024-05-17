
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

import SideBar from '../components/Sidebar';
import { Outlet } from "react-router-dom";


export default function Dashboard() {
    
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

    return (
        <main className="h-screen flex flex-row bg-white">
            <SideBar />
            <div className="flex-grow">
                <Outlet />
            </div>
        </main>
    )
}