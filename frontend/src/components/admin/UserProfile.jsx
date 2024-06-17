import React, { useEffect, useState } from 'react';
import { Paperclip } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';

const UserDetails = () => {

    const [verified, setVerified] = useState(true)

    const [user, setUser] = useState({})

    const { id, viewType } = useParams();

    const token = useSelector((state) => state.token);

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`,
        },
    });

    const fetchCustomers = async () => {
        console.log("fetch customers")
        try {
            const response = await api.get('/admin/view/pendingcustomer');
            const users = response.data;
            users.map(user => {
                console.log(user.id)
                if (user.id == id) {
                    setUser(user);
                }
                return null;
            });
            console.log(response.data)
        } catch (e) {
            console.log(e.response);
        }
    };

    const fetchOwners = async () => {
        console.log("fetch owners")

        try {
            const response = await api.get('/admin/view/pendingowner');
            setUser(response.data);
        } catch (e) {
            console.log(e.response);
        }
    };

    useEffect(() => {
        if (viewType === 'customers') {
            fetchCustomers();
        } else if (viewType === 'owners') {
            fetchOwners();
        }
        console.log(id);
        console.log(viewType);
    }, [viewType]);


    return (
        <section className="max-h-screen w-full m-4 p-4 border-collapse border rounded-xl border-gray-300 flex flex-col">
            <p className="text-xl font-bold text-gray-800">User Information</p>

            <div className="w-full pt-8 flex flex-row">

                <div className="w-1/3 grid grid-rows-4 pr-5  gap-y-10">
                    <div className='row-span-3 flex justify-center'>
                        <img
                            className="w-auto h-auto"
                            src="https://via.placeholder.com/150"
                            alt="Applicant"
                        />
                    </div>
                    <div>Status: {verified ? 'Verified' : 'Verification Pending'}</div>
                    <button className="py-2 bg-black text-white rounded hover:qp">
                        Verify
                    </button>
                    {/* {verified ? (
                        <>
                            <button className="py-2 bg-black text-white rounded hover:bg-qp">
                                Camera Surveillance
                            </button>
                            <button className="px-2 py-2 bg-red-800 text-white rounded hover:bg-red-700">
                                Disable User
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="py-2 bg-black text-white rounded hover:qp">
                                Accept
                            </button>
                            <button className="px-2 py-2 bg-red-800 text-white rounded hover:bg-red-700">
                                Reject
                            </button>
                        </>

                    )
                    } */}
                </div>

                <div className="flex-grow divide-y">
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-lg  text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-lg  text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Contact</dt>
                        <dd className="mt-1 text-lg  text-gray-700 sm:col-span-2 sm:mt-0">{user.contact}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium  text-gray-500">Role</dt>
                        <dd className="mt-1 text-lg  text-gray-700 sm:col-span-2 sm:mt-0">{user.role}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium  text-gray-500">Attachments</dt>
                        <dd className='mt-1 text-lg  text-gray-700 sm:col-span-2 border-collapse border rounded-xl border-gray-300 px-2 py-5'>
                            <div className='flex flex-row gap-x-2 pb-2'>
                                <p className='flex-grow truncate'>{user.document}</p>
                                {user.document && (
                                    <a href={user.document} className='text-qp font-semibold hover:text-blue-700 w-auto' download>View</a>
                                )}
                                {/* <button className='text-qp font-semibold hover:text-blue-700 w-auto'>Download</button> */}
                            </div>
                        </dd>
                    </div>
                </div>


            </div>
        </section>
    );
}

export default UserDetails;
