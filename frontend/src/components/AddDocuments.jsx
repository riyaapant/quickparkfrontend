import React, { useState, useRef } from 'react';
import axios from 'axios';
import config from '../features/config';
import { setCred } from '../features/credSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddDocument = () => {

    const dispatch = useDispatch()

    const isSubmitted = useSelector((state) => state.documentsSubmitted)
    
    // const [documentsSubmitted, setDocumentsSubmitted] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    // const [vehicleId, setVehicleId] = useState('');
    const [document, setDocument] = useState(null);
    const profilePicInputRef = useRef(null);

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(profilePic)
        console.log(document)
        // console.log(vehicleId)

        const profilePicture = new FormData();
        profilePicture.append('file', profilePic);

        const customerDocument = new FormData();
        customerDocument.append('file', document)
        try {
            const profileUploadResponse = await api.put(`upload/image`, {profile:profilePicture}, {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log(profileUploadResponse);

            const documentUploadResponse = await api.put(`upload/customer/file`, {file:customerDocument}, {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log(documentUploadResponse);
            
            dispatch(setCred({
                documentsSubmitted:true
        }))
        } catch (error) {
            dispatch(setCred({
                documentsSubmitted : false
            }))
            console.error('Error uploading file: ', error);
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
        }
    };

    // const handleVehicleIdChange = (e) => {
    //     setVehicleId(e.target.value);
    // };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocument(file);
        }
    };

    const handleProfilePicClick = () => {
        profilePicInputRef.current.click();
    };

    return (
        <div>
            {!isSubmitted ? (
                <div className="h-screen p-10 flex flex-col w-2/3">
                    <section className='h-auto'>
                        <p className='text-2xl font-bold'>Let's get you verified</p>
                        <p className='text-lg'>We will manually verify these documents to list you as a parking land owner</p>
                    </section>

                    <section className='flex-grow justify-center pt-10'>
                        <form className='flex flex-col gap-y-8' onSubmit={handleSubmit}>
                            <div className='flex flex-row justify-between'>
                                <label htmlFor="profile-picture" className='block mb-2'>Upload your profile picture</label>
                                <input
                                    type='file'
                                    id="profile-picture"
                                    name="profilePicture"
                                    ref={profilePicInputRef}
                                    className="w-full hidden"
                                    onChange={handleProfilePicChange}
                                />
                                <div className='cursor-pointer' onClick={handleProfilePicClick}>
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile Preview" className="mt-2 w-40 h-40 object-cover rounded-md border" />
                                    ) : (
                                        <div className="mt-2 w-40 h-40 flex items-center justify-center border rounded-md">
                                            <span className="text-gray-500">Choose Picture</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* <div>
                                <label htmlFor="vehicle-id" className='block mb-2'>Enter your vehicle ID</label>
                                <input
                                    type='text'
                                    id="vehicle-id"
                                    name="vehicleId"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={vehicleId}
                                    onChange={handleVehicleIdChange}
                                    required
                                />
                            </div> */}
                            <div>
                                <label htmlFor="document" className='block mb-2'>Upload your document</label>
                                <input
                                    type='file'
                                    id="document"
                                    name="document"
                                    className="w-full"
                                    onChange={handleDocumentChange}
                                    required
                                />
                                {document && <p className="mt-2">{document.name}</p>}
                            </div>
                            <div className='h-auto'>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Next
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            ) : (
                <div className="h-screen p-20 flex flex-col w-2/3 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg">Documents Submitted</p>
                    <p className="text-lg">We will get back to you shortly!</p>
                </div>
            )}
        </div>
    );
};

export default AddDocument;

