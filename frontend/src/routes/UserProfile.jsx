import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { setCred } from "../features/credSlice";

const UserProfile = () => {

    const dispatch = useDispatch()

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const role = useSelector((state) => state.role)
    const refreshToken = useSelector((state) => state.refreshToken)
    const accessToken = useSelector((state) => state.token)

    const navigate = useNavigate();

    useEffect(() => {
        console.log("isLoggedIn: ",isLoggedIn)
        console.log("Role: ",role)
        console.log("Refresh Token: ",refreshToken)
        console.log("Access Token: ",accessToken)
        if (!isLoggedIn) {
            navigate('/login')
        }
    }, [accessToken, refreshToken, isLoggedIn]);


    function handleLogout() {
        dispatch(setCred({
                    isLoggedIn: false,
                    token: '',
                    refreshToken: '',
                    role:null
                }))
    }

    return (
        <>
            <ul>
                <li>Name: </li>
                <li>Role: </li>
                <li>Address: </li>
                <li>Contact Number: </li>
                <li>Email address: </li>
                <li>Vehicle-number: </li>
            </ul>
            <button onClick={handleLogout} className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Logout</button>
        </>
    )
}

export default UserProfile