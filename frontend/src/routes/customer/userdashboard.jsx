
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

import SideBar from '../../components/customer/Sidebar';
import { Outlet } from "react-router-dom";


export default function UserDashboard() {
    
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const token = useSelector((state) => state.token)
    const is_owner = useSelector((state) => state.is_owner)

    const navigate = useNavigate();

    useEffect(() => {
        console.log("is_owner: ", is_owner)
        if (!token) {
            navigate('/login')
        }
    });


    return (
        <main className="h-screen grid grid-cols-4 bg-white">
            <div className='col-span-1 overflow-y-auto'>
                <SideBar />
            </div>
            <div className="col-span-3 overflow-y-auto">
                <Outlet />
            </div>
        </main>
    )
}