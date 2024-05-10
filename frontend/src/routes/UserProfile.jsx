import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useSelector } from 'react-redux';

const UserProfile = () => {

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const role = useSelector((state) => state.role);
    const token = useSelector((state) => state.token)
    const refreshToken = useSelector((state) => state.refreshToken)

    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn);
        console.log(role);
        console.log(token);
        console.log(refreshToken);
    }, [isLoggedIn, role, token, refreshToken]);

    if (!isLoggedIn) {
        navigate('/login')
    }

    function handleLogout() {
        console.log("Hey")
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