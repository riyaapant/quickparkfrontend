import { APIProvider, Map, Marker, useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../../features/config';
import { useLocation } from 'react-router-dom';


const ViewParkingLocationsOnMap = () => {

    const apikey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
    const map = useMap('locationsmap')

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        }
    });

    const [searchResult, setSearchResult] = useState([{}])

    const handleViewParkingLocations = async () => {
        try {
            const response = await api.get(`/viewownparking`)
            console.log("response: ", response.data)
            setSearchResult(response.data)
        }
        catch (e) {
            console.log(e.response)
        }
    }

    const [activeMarker, setActiveMarker] = useState(null);

    const handleMarkerClick = async(marker) => {
        try{
            console.log(marker)
            const response = await api.get(`viewparking/${marker.id}`)
            console.log(response)
            setActiveMarker(response.data);
        }
        catch(e){
            console.log(e.response)
        }
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    useEffect(() => {
        handleViewParkingLocations()
    }, [])

    return (
        <main className='flex flex-col justify-center items-center h-screen'>

            <APIProvider
                apiKey={apikey}
                libraries={['places']}
            >
                <Map
                    center={{
                        lat: 27.6692194,
                        lng: 85.3341771
                    }}
                    defaultZoom={15}
                    id='locationsmap'
                >
                    {searchResult.length > 0 && searchResult.map((result) => (
                        <>
                            <Marker
                                key={result.id}
                                position={{
                                    lat: result.lat,
                                    lng: result.lon
                                }}
                                id={`search-result-${result.id}`}
                            onClick={() => handleMarkerClick(result)}
                            />

                        </>
                    ))}
                    {activeMarker && (
                        <InfoWindow
                        position={{ lat: activeMarker.lat, lng: activeMarker.lon }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Parking Details</h3>
                            <div className="mb-2">
                                <p className="text-sm"><strong>Address:</strong> {activeMarker.address}</p>
                                <p className="text-sm"><strong>Fee:</strong> {activeMarker.fee}</p>
                                <p className="text-sm"><strong>Total Spaces:</strong> {activeMarker.total}</p>
                                <p className="text-sm"><strong>Used Spaces:</strong> {activeMarker.used}</p>
                                <p className="text-sm"><strong>Owner:</strong> {activeMarker.user}</p>
                            </div>
                        </div>
                    </InfoWindow>
                    
                    )}
                </Map>
            </APIProvider >
        </main>
    )
}

export default ViewParkingLocationsOnMap