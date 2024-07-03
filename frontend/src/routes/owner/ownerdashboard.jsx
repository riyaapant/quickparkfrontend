
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

// import { ProfileProvider, useProfile } from '../../contexts/ProfileContext'; // Import ProfileProvider
import OwnerSidebar from '../../components/owner/OwnerSidebar';

import { Outlet } from "react-router-dom";
// import axios from 'axios';
// import config from '../../features/config';


export default function OwnerDashboard() {

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const token = useSelector((state) => state.token)
    // const isOwnerVerified = useSelector((state) => state.ownerDocumentsSubmitted)

    // const api = axios.create({
    //     baseURL: config.BASE_URL,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + `${token}`
    //     },
    // });

    const navigate = useNavigate();

    // const updateUser = async () => {
    //     try {
    //         const response = api.get(`/update`)
    //         console.log(response)
    //     }
    //     catch (e) {
    //         console.log(e)
    //     }
    // }

    useEffect(() => {
        console.log("user mode: owner")
        console.log("token: ", token)
        // if (isOwnerVerified) {
        //     updateUser()
        // }
        if (!token) {
            navigate('/login')
        }
    });

    return (
        // <ProfileProvider>
            <main className="h-screen grid grid-cols-4 bg-white">
                <div className='col-span-1'>
                    <OwnerSidebar />
                </div>
                <div className="col-span-3">
                    <Outlet />
                </div>
            </main>
        // </ProfileProvider>
    )
}