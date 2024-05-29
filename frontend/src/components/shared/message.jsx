import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

import '../form.css'

import config from "../../features/config";

export default function Message() {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    return (
        <main className="h-screen flex flex-col justify-center items-center">

            {success ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">{message}</span>
                    <Link to="#">
                        <button className="m-3 w-max justify-center rounded-md bg-indigo-950 p-3 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to Home</button>
                    </Link>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#dc2626" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-lg">{message}</span>
                    <Link to="#">
                        <button className="m-3 w-max justify-center rounded-md bg-qp p-3 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to Home</button>
                    </Link>
                </>
            )}
        </main>
    );
}
