import { APIProvider, Map, Marker, useMap, InfoWindow, useMarkerRef } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../../features/config';


const AutoComplete = () => {

    const userLocation = useSelector((state) => state.userLocation)


    const apikey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
    const map = useMap('autocomplete')

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        }
    });

    // const [searchQuery, setSearchQuery] = useState('')

    const [searchResult, setSearchResult] = useState([
        // { id: 6, address: 'Balkumari, Kathmandu', lat: 27.669181, lon: 85.334197 },
        // { id: 7, address: 'Lalitpur, Kathmandu', lat: 27.667022, lon: 85.318130 },
        // { id: 8, address: 'Bhaktapur, Kathmandu', lat: 27.671000, lon: 85.429810 },
    ]);

    // const handleSearchQueryChange = (e) => {
    //     setSearchQuery(e.target.value)
    // }

    // const handleSearchSubmission = () => {
    //     if (!window.google) {
    //         console.error("Google Maps JavaScript API not loaded yet");
    //         return;
    //     }

    //     const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    //     const request = {
    //         query: searchQuery,
    //         fields: ['name', 'geometry']
    //     };

    //     service.textSearch(request, (results, status) => {
    //         if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
    //             setSearchResult(prevResult => [
    //                 ...prevResult,
    //                 ...results.map(result => ({
    //                     name: result.name,
    //                     location: result.geometry.location.toJSON()
    //                 }))
    //             ]);
    //             console.log(searchResult)
    //         } else {
    //             console.error('Place not found:', status);
    //         }
    //     });
    // }

    const handleViewParkingLocations = async () => {
        try {
            const response = await api.get(`/viewparkinglocations`)
            console.log("response: ", response.data)
            setSearchResult(response.data)
        }
        catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        console.log(userLocation)
    }, [userLocation])

    const [activeMarker, setActiveMarker] = useState(null);

    const handleMarkerClick = (marker) => {
        setActiveMarker(marker);
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    return (
        <main className='flex flex-col justify-center items-center h-screen'>
            {/* <div
                className="flex flex-row absolute top-1 p-1 z-10 bg-white rounded shadow-lg w-1/2"
            >
                <input type="text"
                    placeholder="Search for a place"
                    className="p-2 border rounded w-full"
                    onChange={handleSearchQueryChange}
                />
                <button
                    className='w-1/4 justify-center rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800'
                    onClick={handleSearchSubmission}
                >Search</button>
            </div> */}
            <button
                className='absolute top-1 p-3 z-10 justify-center rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800'
                onClick={handleViewParkingLocations}
            >View Parking Locations</button>

            <APIProvider
                apiKey={apikey}
                libraries={['places']}
            >
                <Map
                    center={userLocation}
                    defaultZoom={15}
                    id='autocomplete'
                >
                    <Marker
                        position={userLocation}
                        id='user-location'
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        }}
                        onClick={() => handleMarkerClick({ lat: userLocation.lat, lon: userLocation.lng, address: "You are here" })}
                    />

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
                            <div>
                                <p>{activeMarker.address}</p>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider >

        </main>
    )
}

export default AutoComplete