import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

const Maps2 = () => {

    const apikey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY

    const [userLocation, setUserLocation] = useState({
        lat: 27.6715029,
        lng: 85.3332635,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          },
          (error) => {
            console.error("Error getting location", error);
            // setUserLocation(defaultCenter);
          }
        )
      }, [])

    return (
        <APIProvider apiKey={apikey}>
            <Map center={userLocation} zoom={13}>
                <Marker position={userLocation} />
            </Map>
        </APIProvider>
    )
}

export default Maps2