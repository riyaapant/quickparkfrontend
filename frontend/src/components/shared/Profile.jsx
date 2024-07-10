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
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const profilePicInputRef = useRef(null);
    const [loading, setLoading] = useState(false)

    const [upload, setUpload] = useState(false)

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
        status: false
    })

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setProfilePicPreview(URL.createObjectURL(file));
            // console.log(file)
            setUpload(true)
        }
        else {
            console.log("File not found")
            setUpload(false)
        }
    };

    const handleProfilePicClick = () => {
        profilePicInputRef.current.click();
    };

    const handleProfilePictureUpload = async (e) => {
        e.preventDefault()
        // console.log(profilePic)
        setLoading(true)

        if (!profilePic) {
            console.error('No profile picture selected');
            setLoading(false);
            return;
        }

        const profilePicture = new FormData();
        profilePicture.append('profile', profilePic);

        try {
            const profileUploadResponse = await api.put(`upload/image`, profilePicture, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log("profile upload response: ", profileUploadResponse);
        }
        catch (e) {
            console.log(e.response)
        }
        setLoading(false)
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
                console.log("get profile: ", response.data)
                setUser({
                    name: response.data.firstName + ' ' + response.data.lastName,
                    email: response.data.email,
                    contact: response.data.contact,
                    address: response.data.address,
                    isOwner: response.data.isOwner,
                    document: response.data.document,
                    profile: response.data.profile,
                    vehicleId: response.data.vehicleId,
                    status: response.data.is_paperverified
                });
                // setLoading(false)
            } catch (error) {
                console.log(error);
            }
            setLoading(false)
        };

        fetchProfile();
    }, [user]);

    return (
        <section className="max-h-screen m-4 p-4 border-collapse border rounded-xl border-gray-200 flex flex-col">
            {loading && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )}
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
                                    <img src={profilePicPreview} alt="Profile Preview" className="mt-2 w-40 h-40 object-cover rounded-md border" />
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
                            {upload &&
                                <button className='flex w-2/3 justify-center rounded-md bg-qp py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 ' onClick={handleProfilePictureUpload}>Upload</button>
                            }
                        </div>
                    )

                    }
                    <div className={`text-center font-semibold ${user.status ? 'text-green-900' : 'text-yellow-600'}`}>{user.status ? 'Verified' : 'Verification pending'}</div>
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
                    {user.vehicleId &&
                        <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                            <dt className="text-lg font-medium text-gray-500">Vehicle-Id</dt>
                            <dd className="mt-1 text-lg text-gray-800 sm:col-span-2 sm:mt-0">
                                {user.vehicleId}
                            </dd>
                        </div>
                    }
                    <div className=" py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Attachments</dt>
                        <dd className='mt-1 text-lg text-gray-800 sm:col-span-2'>
                            {user.document ? (<a href={user.document} className='text-qp font-semibold hover:text-blue-700 w-auto' download>View</a>) : ('No document added')}
                        </dd>
                    </div>
                </div>
            </div>
        </section>



    );
}
