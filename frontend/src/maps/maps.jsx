import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Maps = () => {


  const apikey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY

  const map = useMap('fetchUserLocation')

  const [locationFetched, setLocationFetched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [message, setMessage] = useState(true)

  const fetchUserLocation = () => {
    console.log("Getting user location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationFetched(true)
        setMessage(true)
        setErrorMessage('')
      },
      (error) => {
        setErrorMessage("Error getting location. Please try again.")
      }
    );
  };

  useEffect(()=>
  console.log(userLocation))

  const onMapClick = (e) => {
    setUserLocation({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    })
    console.log(userLocation)
  }

  const onMarkerDrag = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setUserLocation(newLocation);
    console.log(userLocation)
  }


  return (
    <main className='flex flex-col justify-center items-center h-screen'>

      {!locationFetched ?
        (
          <>
            <button
              className="w-48 rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={fetchUserLocation}
            >
              Get your location
            </button>
            {errorMessage && (
              <p className='mt-4 text-red-600'>{errorMessage}</p>
            )}
          </>
        )

        :

        (
          <>
            <APIProvider
              apiKey={apikey}>

              <Map
                id='fetchUserLocation'
                center={userLocation}
                defaultZoom={15}
                onClick={onMapClick}
              >
                <Marker
                  position={userLocation}
                  draggable={true}
                  onDragEnd={onMarkerDrag}
                />
              </Map>
            </APIProvider >
            {message &&
              <>
                <p className='text-lg'>Click on the map or drag the marker to change your location. Click
                  <Link to="/dashboard/home" className='text-qp underline'>confirm</Link> once you're done.</p>
              </>
            }
          </>
        )

      }

    </main>
  )
}

export default Maps