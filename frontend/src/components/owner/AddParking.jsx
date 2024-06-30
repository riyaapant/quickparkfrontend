import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../features/config';

const AddParking = () => {
    const [success, setSuccess] = useState(false);
    const [document, setDocument] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        fee: '', // default fee
        total_spot: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const location = useSelector((state) => state.userLocation);
    const token = useSelector((state) => state.token);

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocument(file);
        } else {
            console.log("File not found");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parkingData = new FormData();
        parkingData.append('address', formData.address);
        parkingData.append('fee', formData.fee);
        parkingData.append('total_spot', formData.total_spot);
        parkingData.append('lat', location.lat);
        parkingData.append('lon', location.lng);
        if (document) {
            parkingData.append('file', document);
        }
        else{
            console.log("document empty")
        }

        // Log the contents of the FormData
        for (let [key, value] of parkingData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await api.post(`/addparking`, parkingData);
            // const response = await api.post(`/addparking`, {
            //     'address': formData.address,
            //     'fee': formData.fee,
            //     'total_spot': formData.total_spot,
            //     'lat': location.lat,
            //     'lon': location.lng,
            //     'file':document
            // });
            console.log(response);
            setSuccess(true);
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            {!success ? (
                <form
                    className="w-full max-w-lg bg-white p-8 rounded shadow-md"
                    onSubmit={handleSubmit}
                >
                    <p className='text-xl font-bold mb-4'>Add Parking</p>

                    <div className='mb-4'>
                        <label htmlFor="document" className='block text-gray-700 text-sm font-bold mb-2'>Upload your land taxation document
                            <span className='text-red-700 font-semibold'> *</span>
                        </label>
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="w-full px-3 py-2 border rounded"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fee">
                            Fee
                        </label>
                        <input
                            type="text"
                            name="fee"
                            id="fee"
                            className="w-full px-3 py-2 border rounded"
                            value={formData.fee}
                            onChange={handleChange}
                            placeholder="50.00"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_spot">
                            Total Spot
                        </label>
                        <input
                            type="text"
                            name="total_spot"
                            id="total_spot"
                            className="w-full px-3 py-2 border rounded"
                            value={formData.total_spot}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errorMessage && (
                        <p className='text-red-600 mb-4 text-center font-semibold'>{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
                    >
                        Add Parking
                    </button>
                </form>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">Parking added successfully</span>
                    <Link to="/owner/dashboard/parkinglocations">
                        <button className="m-3 w-max justify-center rounded-md bg-indigo-950 p-3 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default AddParking;
