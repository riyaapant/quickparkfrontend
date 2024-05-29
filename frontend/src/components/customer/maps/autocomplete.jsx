import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const AutoComplete = () => {

    const userLocation = useSelector((state) => state.userLocation)

    const apikey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY
    const map = useMap('autocomplete')

    const [searchQuery, setSearchQuery] = useState('')

    const [searchResult, setSearchResult] = useState([{}])

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchSubmission = () => {
        if (!window.google) {
            console.error("Google Maps JavaScript API not loaded yet");
            return;
        }

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            query: searchQuery,
            fields: ['name', 'geometry']
        };

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setSearchResult(prevResult => [
                    ...prevResult,
                    ...results.map(result => ({
                        name: result.name,
                        location: result.geometry.location.toJSON()
                    }))
                ]);
                console.log(searchResult)
            } else {
                console.error('Place not found:', status);
            }
        });
    }

    useEffect(()=>{
        console.log(userLocation)
    },[userLocation])

    // function handleLocationConfirm(){
    //     console.log("confirm")
    // }

    return (
        <main className='flex flex-col justify-center items-center h-screen'>
            <div
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
            </div>

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
                    />
                    {searchResult.map((result, index) => (
                        <Marker
                            key={index}
                            position={result.location}
                            id='search-results'
                        />
                    ))}
                </Map>
            </APIProvider >
            
        </main>
    )
}

export default AutoComplete