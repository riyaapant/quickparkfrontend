import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import config from "../../features/config";
import axios from "axios";
import { X, Bookmark } from 'lucide-react';

const ParkingInfoWindow = ({ marker, onClose }) => {
    const token = useSelector((state) => state.token);

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [spots, setSpots] = useState([]);
    const [parkingResponse, setParkingResponse] = useState({});
    const [userVehicleId, setUserVehicleId] = useState('');
    const [isUserVerified, setIsUserVerified] = useState(false);
    const [value, setValue] = useState('');
    const [timeElapsed, setTimeElapsed] = useState('')
    const [startTime, setStartTime] = useState(null);

    const [releasePrompt, setReleasePrompt] = useState(false);
    const [releaseReason, setReleaseReason] = useState('');
    const [releaseMessage, setReleaseMessage] = useState('');

    const socketUrl = `ws://192.168.35.103:2564/parking/${marker.id}/${userVehicleId}`;
    // const socketUrl = `ws://192.168.222.103:2564/parking/${marker.id}/${userVehicleId}`;
    // const socketUrl = `ws://110.44.121.73:2564/parking/${marker.id}/${userVehicleId}`;

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(userVehicleId ? socketUrl : null);

    const handleReserve = useCallback(() => {
        if (readyState === ReadyState.OPEN) {
            const message = JSON.stringify({ action: 'reserve' });
            sendMessage(message);
        }
        setReleaseMessage('');
    }, [readyState, sendMessage]);

    const handleRelease = useCallback((e) => {
        e.preventDefault();
        if (readyState === ReadyState.OPEN) {
            const message = JSON.stringify({ action: 'release' });
            sendMessage(message);
        }
        setReleasePrompt(false);
        setReleaseReason('');
    }, [readyState, sendMessage]);

    // const handlePark = useCallback(() => {
    //     if (readyState === ReadyState.OPEN) {
    //         const message = JSON.stringify({ action: 'park' });
    //         sendMessage(message);
    //     }
    //     setReleaseMessage('');
    // }, [readyState, sendMessage]);

    const fetchProfile = async () => {
        try {
            const response = await api.get(`/profile`);
            setUserVehicleId(response.data.vehicleId);
            setIsUserVerified(response.data.is_paperverified || false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            console.log(data)
            setParkingResponse(data);

            // if(data.value === 'Reserve'){
            //     handleIoTRelease()
            // }

            if (data.value !== undefined) {
                setValue(data.value);
            }

            if (data.message !== undefined) {
                setReleaseMessage(data.message);
            }

            if (data.start_time !== undefined) {
                setStartTime(data.start_time);
            }

            if (data.total_spot !== undefined && data.used_spot !== undefined) {
                const totalSpots = data.total_spot;
                const usedSpots = data.used_spot;

                const newSpots = Array(totalSpots).fill('empty');

                for (let i = 0; i < usedSpots; i++) {
                    newSpots[i] = 'reserved';
                }

                setSpots(newSpots);
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        let interval;
        if (startTime) {
            interval = setInterval(() => {
                const start = new Date(startTime);
                const now = new Date();
                const diff = Math.floor((now - start) / 1000);
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <div className="bg-white p-4 rounded-md text-qp absolute top-28 left-1/4 h-auto w-auto m-auto shadow-2xl border-qp-8">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-2">Parking Details</h3>
                {value === 'Reserved' && <Bookmark className='absolute right-12 top-0 size-10 text-yellow-600 fill-yellow-600' />}
                {value === 'Parked' && <Bookmark className='absolute right-12 top-0 size-10 text-green-600 fill-green-600' />}

                <X className='hover:cursor-pointer' onClick={onClose} />
            </div>
            <p className="text-sm"><strong>Id:</strong> {marker.id}</p>
            <p className="text-sm"><strong>Address:</strong> {marker.address}</p>
            <p className="text-sm"><strong>Fee:</strong> {marker.fee}</p>
            <p className="text-sm"><strong>Empty Spaces:</strong> {parkingResponse.total_spot - parkingResponse.used_spot}/{parkingResponse.total_spot}</p>
            <p className="text-sm"><strong>Owner:</strong> {marker.user}</p>
            <div className="grid grid-cols-5 gap-2 my-4">
                {spots.map((spot, index) => (
                    <div
                        key={index}
                        className={`w-16 h-8 ${spot === 'empty' ? 'bg-green-600' : 'bg-qp'
                            }`}
                    ></div>
                ))}
            </div>

            {!userVehicleId ? (
                <p className='text-red-900 font-semibold'>Register a vehicle ID first</p>
            ) : (
                !isUserVerified ? (
                    <p className='text-red-900 font-semibold'>You are not verified to reserve parking space</p>
                ) : (
                    <>
                        {value === 'Reserved' &&
                            <>
                                <p className='text-center pb-2 text-qp'>You have reserved!</p>
                                <p className='text-center pb-2 text-qp'>Elapsed time: {timeElapsed}</p>
                            </>}
                        {value === 'Parked' &&
                            <>
                                <p className='text-center pb-2 text-qp'>You are parked!</p>
                                <p className='text-center pb-2 text-qp'>Elapsed time: {timeElapsed}</p>
                            </>
                        }
                        {releaseMessage && <p className='text-center pb-2 text-qp'>{releaseMessage}</p>}

                        {releasePrompt &&
                            <form className='flex flex-col items-center' onSubmit={handleRelease}>
                                <input type='text' id='release-reason' name='release-reason' className='w-full p-2 border-collapse border-2 rounded-lg mb-2' placeholder='Please state why' value={releaseReason} onChange={(e) => setReleaseReason(e.target.value)}></input>
                                <button type='submit' className="w-1/2 p-1 z-10 rounded-md bg-red-900 text-md font-semibold text-white hover:bg-red-600" disabled={readyState !== ReadyState.OPEN}>
                                    Release
                                </button>
                            </form>}

                        {!releasePrompt &&
                            <div className='flex gap-x-2 justify-center'>
                                {value === 'Reserve' &&
                                    <button className="w-1/2 p-1 z-10 rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800" onClick={handleReserve} disabled={readyState !== ReadyState.OPEN}>
                                        Reserve
                                    </button>
                                }
                                {value === 'Reserved' &&
                                    <button className="w-1/2 p-1 z-10 rounded-md bg-red-900 text-md font-semibold text-white hover:bg-red-600" onClick={() => setReleasePrompt(true)} disabled={readyState !== ReadyState.OPEN}>
                                        Release
                                    </button>
                                }
                            </div>
                        }
                    </>
                )
            )}

        </div>
    );
};

export default ParkingInfoWindow;
