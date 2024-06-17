import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import config from "../../features/config";
import axios from "axios";
import { X } from 'lucide-react';

const ParkingInfoWindow = ({ marker, onClose }) => {

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [spots, setSpots] = useState([]);
    const [parkingResponse, setParkingResponse] = useState({})
    const [status, setStatus] = useState('empty')
    const [userVehicleId, setUserVehicleId] = useState('')


    const socketUrl = `ws://localhost:2564/parking/${marker.id}/${userVehicleId}`;

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl);

    const handleReserve = useCallback(() => {
        if (readyState === ReadyState.OPEN) {
            const message = JSON.stringify({ action: 'reserve' });
            sendMessage(message);
        }
        setStatus('reserved')
    }, [readyState, sendMessage]);

    const handleRelease = useCallback(() => {
        if (readyState === ReadyState.OPEN) {
            const message = JSON.stringify({ action: 'release' });
            sendMessage(message);
        }
        setStatus('empty')
    }, [readyState, sendMessage]);

    const handlePark = useCallback(() => {
        if (readyState === ReadyState.OPEN) {
            const message = JSON.stringify({ action: 'park' });
            sendMessage(message);
        }
        setStatus('parked')
    }, [readyState, sendMessage]);

    const fetchProfile = async () => {
        try {
            const response = await api.get(`/profile`);
            console.log("profile: ",response)
            setUserVehicleId(response.data.vehicleId);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile()
        console.log("connection status: ", connectionStatus)
        if (lastMessage !== null) {
            console.log('message: ', lastMessage.data);
            const data = JSON.parse(lastMessage.data);
            setParkingResponse(data)
            console.log("socket response: ", data)
            const totalSpots = data.total_spot;
            const usedSpots = data.used_spot;
            const parkedSpots = data.parked_spots || 0;
            const newSpots = Array(totalSpots).fill('empty');

            for (let i = 0; i < usedSpots; i++) {
                newSpots[i] = 'reserved';
            }

            for (let i = 0; i < parkedSpots; i++) {
                newSpots[i] = 'parked';
            }

            setSpots(newSpots);
        }
    }, [lastMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div className="bg-white p-4 rounded-md text-qp absolute top-28 left-1/4 h-auto w-1/2 m-auto shadow-2xl border-qp-8">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-2">Parking Details</h3>
                <X className='hover:cursor-pointer' onClick={onClose} />
            </div>
            <p className="text-sm"><strong>Id:</strong> {marker.id}</p>
            <p className="text-sm"><strong>Address:</strong> {marker.address}</p>
            <p className="text-sm"><strong>Fee:</strong> {marker.fee}</p>
            <p className="text-sm"><strong>Total Spaces:</strong> {parkingResponse.total_spot}</p>
            <p className="text-sm"><strong>Used Spaces:</strong> {parkingResponse.used_spots}</p>
            <p className="text-sm"><strong>Owner:</strong> {marker.user}</p>
            <p className="text-sm"><strong>Status:</strong> {status}</p>
            <div className="grid grid-cols-5 gap-2 my-4">
                {spots.map((spot, index) => (
                    <div
                        key={index}
                        className={`w-16 h-8 ${spot === 'empty' ? 'bg-green-500' : 'bg-qp'
                            }`}
                    ></div>
                ))}
            </div>

            <div className='flex gap-x-2 justify-center'>
                {status === 'empty' ? (<>
                    <button className="w-1/2 p-1 z-10 rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800" onClick={handleReserve} disabled={readyState !== ReadyState.OPEN}>
                        Reserve
                    </button>
                </>) : (<>
                    <button className="w-1/2 p-1 z-10 rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800" onClick={handleRelease} disabled={readyState !== ReadyState.OPEN}>
                        Release
                    </button>
                    <button className="w-1/2 p-1 z-10 rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800" onClick={handlePark} disabled={readyState !== ReadyState.OPEN}>
                        Park
                    </button>
                </>)}
            </div>
        </div>

    );
};

export default ParkingInfoWindow;
