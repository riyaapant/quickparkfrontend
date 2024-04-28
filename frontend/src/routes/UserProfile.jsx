// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";

const UserProfile = () => {

    const navigate = useNavigate();
    const { auth, setAuth} = useContext(AuthContext);

    if(!auth.isLoggedIn){
        navigate('/login')
    }

    function handleLogout(){
        setAuth({});
    }

    useEffect(() => {
        console.log(auth)
    }, [auth]); 

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