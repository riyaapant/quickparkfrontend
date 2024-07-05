import { useState, useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';

export default function EditProfile() {

    const navigate = useNavigate()
    const token = useSelector((state) => state.token);

    const [updateMessage, setUpdateMessage] = useState('')

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });


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
    });

    // const fileInputRef = useRef(null);
    // const profilePicInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`${config.BASE_URL}/profile`);
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

    const handleVehicleIdChange = (e) => {
        setUser({
            ...user,
            vehicleId: e.target.value
        });
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setUser({
    //             ...user,
    //             document: file.name
    //         });
    //     }
    // };

    // const handleProfilePicChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const profilePicUrl = URL.createObjectURL(file);
    //         setUser({
    //             ...user,
    //             profile: profilePicUrl
    //         });
    //     }
    // };

    // const handleBrowseClick = () => {
    //     fileInputRef.current.click();
    // };

    // const handleProfilePicClick = () => {
    //     profilePicInputRef.current.click();
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`${config.BASE_URL}/vehicleid`, {
                vehicle_id: user.vehicleId
            });
            console.log('Vehicle id updated successfully:', response.data);
            setUpdateMessage(`User has been verified successfully.`);
            // setTimeout(() => setUpdateMessage(''), 5000);
        } catch (error) {
            console.error('Error updating vehicle id:', error);
        }
        // finally {
        //     navigate(-1)
        // }
    };

    const cancelUpdate = () => {
        setUser({
            ...user
        });
        navigate(-1)
    };

    return (
        <section className="max-h-screen m-4 p-4 border-collapse border rounded-xl border-gray-200 flex flex-col">
            <div className='flex flex-row justify-between'>
                <p className="text-xl font-bold text-gray-800">Edit Profile</p>
            </div>

            <div className="pt-8 flex-grow flex flex-row">
                <div className="w-1/3 grid grid-rows-6 pr-5 gap-y-10">
                    <div className='row-span-4 flex justify-center border'>
                        <img
                            className="w-auto h-full"
                            src={user.profile}
                            alt="Profile"
                        />
                    </div>
                    {/* <div className='row-span-1 text-lg text-center text-qp hover:text-blue-700 w-auto font-semibold cursor-pointer'
                        onClick={handleProfilePicClick}>
                        Upload a profile picture
                    </div> */}
                    <div className='row-span-1 text-center'>Status: {user.status}</div>
                    <input
                        type="file"
                        // ref={profilePicInputRef}
                        style={{ display: 'none' }}
                    // onChange={handleProfilePicChange}
                    />
                </div>

                <div className="flex-grow divide-y">
                    <div className="px-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="py-4 text-lg font-medium text-gray-500">Full name</dt>
                        <dd className="py-4 mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                        {/* <dd className="py-1 mt-1 text-lg text-gray-900 sm:col-span-2 sm:mt-0">
                            <input required placeholder='Your Name' id="name" type='text' className="w-full py-3" value={user.name} onChange={handleNameChange} />
                        </dd> */}
                    </div>
                    <div className="px-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="py-4 text-lg font-medium text-gray-500">Email</dt>
                        <dd className="py-4 mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                    </div>
                    <div className="px-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="py-4 text-lg font-medium text-gray-500">Address</dt>
                        <dd className="py-4 mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">{user.address}</dd>

                        {/* <dd className="py-1 mt-1 text-lg text-gray-900 sm:col-span-2 sm:mt-0">
                            <input required placeholder='Address' type='text' className="w-full py-3" value={user.address} onChange={handleAddressChange} />
                        </dd> */}
                    </div>
                    <div className="px-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="py-4 text-lg font-medium text-gray-500">Contact</dt>
                        <dd className="py-4 mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">{user.contact}</dd>

                        {/* <dd className="py-1 mt-1 text-lg text-gray-900 sm:col-span-2 sm:mt-0">
                            <input required placeholder='Contact' type="tel" maxLength={10} minLength={10} className="w-full py-3" value={user.contact} onChange={handleContactChange} />
                        </dd> */}
                    </div>
                    <div className="px-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="py-4 text-lg font-medium text-gray-500">Vehicle-Id</dt>
                        <dd className="py-1 mt-1 text-lg text-gray-900 sm:col-span-2 sm:mt-0">
                            <input required placeholder='Vehicle Id' type='text' maxLength={8} className="w-full py-3" value={user.vehicleId} onChange={handleVehicleIdChange} />
                        </dd>
                    </div>
                    <div className="px-2 py-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Attachments</dt>
                        <dd className='mt-1 text-lg text-gray-800 sm:col-span-2'>
                            {user.document ? (<a href={user.document} className='text-qp font-semibold hover:text-blue-700 w-auto' download>View</a>) : ('Add')}
                        </dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        {!updateMessage ? (<>
                            <button onClick={handleSubmit} type="submit" className="px-5 justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500" >Update Profile</button>
                            <button onClick={cancelUpdate} className="px-5 justify-center rounded-md bg-slate-100 py-1.5 text-md font-semibold leading-6 text-gray-500 shadow-sm hover:bg-slate-200 hover:text-gray-700" >Cancel</button>
                        </>
                        ) : (<div className='flex flex-col'>
                            <span>
                                Profile updated successfully
                            </span>
                            <button onClick={() => navigate(-1)} type="submit" className="px-5 justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500" >Go back</button>
                        </div>)}

                    </div>
                </div>
            </div>
        </section>
    );
}
