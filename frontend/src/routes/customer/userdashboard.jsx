
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

import SideBar from '../../components/customer/Sidebar';
import { Outlet } from "react-router-dom";


export default function UserDashboard() {
    
    const isLoggedIn = useSelector((state) => state.isLoggedIn);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("user mode: customer")
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