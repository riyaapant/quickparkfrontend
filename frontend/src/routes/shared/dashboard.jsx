
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

import SideBar from '../../components/shared/Sidebar';
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
        <main className="h-screen grid grid-cols-4 bg-white">
            <div className='col-span-1'>
                <SideBar />
            </div>
            <div className="col-span-3">
                <Outlet />
            </div>
        </main>
    )
}