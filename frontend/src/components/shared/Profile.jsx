import { useState, useRef } from 'react';
import { Paperclip, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';
import { Link } from 'react-router-dom';

export default function Profile() {

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL
    });

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const [profilePic, setProfilePic] = useState(null);
    const profilePicInputRef = useRef(null);

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

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            console.log(file)
        }
        console.log("File not found")
    };

    const handleProfilePicClick = () => {
        profilePicInputRef.current.click();
    };

    const handleProfilePictureUpload = async(e) => {
        e.preventDefault()
        console.log(profilePic)

        const profilePicture = new FormData();
        profilePicture.append('profile', profilePic);

        try {
            const profileUploadResponse = await api.put(`upload/image`, profilePicture, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log(profileUploadResponse);
        }
        catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + `${token}`
                    }
                });
                console.log(response.data)
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
                    {user.profile ? (
                        <div className='row-span-3 flex justify-center border'>
                            <img
                                className="w-2/3 h-auto"
                                src={user.profile}
                                alt="Profile"
                            />
                        </div>
                    ) : (
                        <div className=' flex flex-col gap-y-3 justify-center items-center'>
                            <div className='cursor-pointer' onClick={handleProfilePicClick}>
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile Preview" className="mt-2 w-40 h-40 object-cover rounded-md border" />
                                ) : (
                                    <div className="mt-2 w-40 h-40 flex items-center justify-center border rounded-md">
                                        <span className="text-gray-500">Choose Picture</span>
                                    </div>
                                )}
                            </div>
                            <label htmlFor="profile-picture" className='block mb-2'>Upload your profile picture</label>
                            <input
                                type='file'
                                id="profile-picture"
                                name="profilePicture"
                                ref={profilePicInputRef}
                                className="w-full hidden"
                                onChange={handleProfilePicChange}
                            />
                            <button className='flex w-2/3 justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 ' onClick={handleProfilePictureUpload}>Upload</button>
                        </div>
                    )

                    }
                    {/* <div className='row-span-3 flex justify-center border'>
                        <img
                            className="w-2/3 h-auto"
                            src={user.profile}
                            alt="Profile"
                        />
                    </div> */}
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
                            <div className='flex items-center gap-x-2'>
                                <Paperclip className='w-6 h-6' />
                                <p className='flex-grow'>https://res.cloudinary.com/d...</p>
                                <button className='text-qp hover:text-blue-700'>
                                    {!user.document ? (<Link to="#">Add Documents</Link>) : ('Download')}
                                </button>
                            </div>
                        </dd>
                    </div>
                </div>
            </div>
        </section>



    );
}
