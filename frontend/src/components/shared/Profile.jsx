import { useState } from 'react';
import { Paperclip, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';
import { Link } from 'react-router-dom';

export default function Profile() {

    const token = useSelector((state) => state.token)

    const api = axios.create({
        // baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const [user, setUser] = useState({
        name: '',
        email: '',
        contact: '',
        address: '',
        document: '',
        profile: '',
        vehicleId: '',
        isOwner: false,
        status: 'pending'
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`${config.BASE_URL}/profile`);
                console.log(response)
                setUser({
                    name: response.data.firstName + ' ' + response.data.lastName,
                    email: response.data.email,
                    contact: response.data.contact,
                    address: response.data.address,
                    isOwner: response.data.isOwner,
                    document: response.data.document,
                    profile: response.data.profile,
                    vehicleId: response.data.vehicleId,
                    status: 'pending'
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <section className="max-h-screen m-4 p-4 border-collapse border rounded-xl border-gray-200 flex flex-col">
            <div className='flex flex-row justify-between'>
                <p className="text-xl font-bold text-gray-800">Profile</p>
                <Settings className='cursor-pointer' onClick={toggleDropdown} />
                {dropdownVisible && (
                    <div className='absolute right-10 top-16 flex flex-col  bg-white border rounded-lg shadow-lg divide-y'>
                        <Link to="edit">
                            <button className="w-48 px-4 py-3 text-left text-black hover:bg-gray-200">Edit Profile</button>
                        </Link>
                        <Link to="changepassword">
                            <button className="w-48 px-4 py-3 text-left text-black hover:bg-gray-200">Change Password</button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="pt-8 flex-grow flex flex-row">
                <div className="w-1/3 grid grid-rows-6 pr-5 gap-y-10">
                    <div className='row-span-3 flex justify-center border'>
                        <img
                            className="w-auto h-full"
                            src={user.profile}
                            alt="Profile"
                        />
                    </div>
                    <div className='text-center'>Status: {user.status}</div>
                </div>


                <div className="flex-grow divide-y">
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-lg text-gray-800 sm:col-span-2 sm:mt-0">{user.name}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-lg text-gray-800 sm:col-span-2 sm:mt-0">{user.email}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-lg text-gray-800 sm:col-span-2 sm:mt-0">{user.address}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Contact</dt>
                        <dd className="mt-1 text-lg text-gray-800 sm:col-span-2 sm:mt-0">{user.contact}</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Vehicle-Id</dt>
                        <dd className="mt-1 text-lg text-gray-800 sm:col-span-2 sm:mt-0">
                            {user.vehicleId}
                        </dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Attachments</dt>
                        <dd className='mt-1 text-lg text-gray-800 sm:col-span-2 border-collapse border rounded-xl border-gray-300 px-2 py-5'>
                            <div className='flex flex-row gap-x-2 pb-2'>
                                <Paperclip className='w-auto' />
                                <p className='flex-grow truncate'>{user.document}</p>
                                <button className='text-qp hover:text-blue-700 w-auto'>
                                    {!user.document ? ('Add Documents') : ('Download')}
                                </button>
                            </div>
                        </dd>
                    </div>
                </div>
            </div>
        </section>



    );
}
