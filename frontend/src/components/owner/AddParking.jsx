import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../features/config';
// import { addParking } from '../../../features/parkingSlice';

const AddParking = () => {

    const [success, setSuccess] = useState(false);

    const location = useSelector((state) => state.userLocation);
    const token = useSelector((state)=> state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [parkingData, setParkingData] = useState({
        address: '',
        fee: '',
        total_spot: '',
        lat: location.lat,
        lon: location.lng
    })
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setParkingData({
            ...parkingData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(parkingData)
        try{
            await api.post(`/addparking`, parkingData)
            setSuccess(true)
        } catch(e){
            console.log(e)
            setErrorMessage(e.response.data)
        }
    };

    useEffect(() => {
        console.log(location)
    },[])

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            {!success ? (
                <form
                className="w-full max-w-lg bg-white p-8 rounded shadow-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-semibold mb-6">Add Parking</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        className="w-full px-3 py-2 border rounded"
                        value={parkingData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fee">
                        Fee (default: 50)
                    </label>
                    <input
                        type="text"
                        name="fee"
                        id="fee"
                        className="w-full px-3 py-2 border rounded"
                        value={parkingData.fee}
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
                        value={parkingData.total_spot}
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
            ):(
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg"></span>
                    <Link to="/owner/dashboard">
                        <button className="m-3 w-max justify-center rounded-md bg-indigo-950 p-3 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Parking added successfully</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default AddParking;
