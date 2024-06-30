import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCred } from '../../../features/credSlice';
import axios from 'axios';
import config from '../../../features/config';

const OwnerMaps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const token = useSelector((state)=> state.token)
  const [documentsVerified,setDocumentsVerified] = useState(false)

  const [loading, setLoading] = useState(false)

  const apikey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const api = axios.create({
    baseURL: config.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + `${token}`
    },
});
  // const map = useMap('fetchUserLocation');

  const [locationFetched, setLocationFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [message, setMessage] = useState(true);

  const fetchUserLocation = () => {
    setLoading(true)
    console.log("Getting user location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLocationFetched(true);
        setMessage(true);
        setErrorMessage('');
      },
      (error) => {
        setErrorMessage("Error getting location. Please try again.");
      }
    );
    setLoading(false)
  };

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await api.get(`/profile`);
            console.log(response)
            if(response.data.is_paperverified===true){
                setDocumentsVerified(true)
            }
        } catch (error) {
            console.log(error);
        }
    };

    fetchProfile();
}, []);

  // const onMapClick = (e) => {
  //   const newLocation = {
  //     lat: e.detail.latLng.lat(),
  //     lng: e.detail.latLng.lng(),
  //   };
  //   setUserLocation(newLocation);
  //   // console.log(newLocation);
  // };

  const onMarkerDrag = (e) => {
    const newLocation = {
      lat: parseFloat(e.latLng.lat().toFixed(7)),
      lng: parseFloat(e.latLng.lng().toFixed(7))
    };
    setUserLocation(newLocation);
    console.log(newLocation);
  };

  const handleLocationConfirm = () => {
    dispatch(setCred({ userLocation: userLocation }))
    console.log('confirm')
    navigate('/owner/dashboard/addparking');
  }

  return (
    <main className='flex flex-col justify-center items-center h-screen'>
      {loading && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )}
      {/* {documentsVerified ? (
        <>
          {!locationFetched ? (
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
          ) : (
            <>
              <APIProvider apiKey={apikey}>
                <Map
                  id='fetchUserLocation'
                  center={userLocation}
                  defaultZoom={15}
                  // onClick={onMapClick}
                >
                  <Marker
                    position={userLocation}
                    draggable={true}
                    onDragEnd={onMarkerDrag}
                  />
                </Map>
              </APIProvider>
              {message && (
                <>
                  <p className='text-lg'>Drag the marker to change your location. Click
                    <button className='text-qp underline px-1' onClick={handleLocationConfirm}>confirm</button> once you're done.</p>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <p>You need to be verified before you can list your parking land</p>
      )
      } */}
          {!locationFetched ? (
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
          ) : (
            <>
              <APIProvider apiKey={apikey}>
                <Map
                  id='fetchUserLocation'
                  center={userLocation}
                  defaultZoom={15}
                  // onClick={onMapClick}
                >
                  <Marker
                    position={userLocation}
                    draggable={true}
                    onDragEnd={onMarkerDrag}
                  />
                </Map>
              </APIProvider>
              {message && (
                <>
                  <p className='text-lg'>Drag the marker to change your location. Click
                    <button className='text-qp underline px-1' onClick={handleLocationConfirm}>confirm</button> once you're done.</p>
                </>
              )}
            </>
          )}
    </main>
  );
};

export default OwnerMaps;
