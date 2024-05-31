import React, { useState } from 'react';
import axios from 'axios';
import config from '../../features/config';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AddDocument = () => {


    const [loading, setLoading] = useState(false)

    const [documentsSubmitted, setDocumentsSubmitted] = useState(false)

    const [vehicleId, setVehicleId] = useState('');
    const [document, setDocument] = useState(null);

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true)
        const customerDocument = new FormData();
        customerDocument.append('file', document)
        try {

            const documentUploadResponse = await api.put(`upload/customer/file`, customerDocument, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log(documentUploadResponse);

            const vehicleIdResponse = await api.put(`vehicleid`, {vehicle_id:vehicleId}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + `${token}`
                }
            })
            console.log(vehicleIdResponse)
            setDocumentsSubmitted(true)

        } catch (error) {
            console.error('Error uploading file: ', error);
        }
        setLoading(false)
    };

    const handleVehicleIdChange = (e) => {
        setVehicleId(e.target.value);
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocument(file);
            // console.log(file)
        }
        else{
            console.log("File not found")
        }
    };

    const fetchProfile = async() => {
        try{
            const response = await api.get(`/profile`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log(response)
            if(response.data.document){
                setDocumentsSubmitted(true)
            }
        }
        catch(e){
            console.log(e.response)
        }
    }


    useEffect(()=>{
        fetchProfile()
    },[])

    return (
        <div>
            {loading && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            )}
            {!documentsSubmitted ? (
                <div className="h-screen p-10 flex flex-col w-2/3">
                    <section className='h-auto'>
                        <p className='text-2xl font-bold'>Let's get you verified</p>
                        <p className='text-lg'>We will manually verify these documents to list you as a customer</p>
                    </section>

                    <section className='flex-grow justify-center pt-10'>
                        <form className='flex flex-col gap-y-8 divide-y-2' onSubmit={handleSubmit}>
                            <div className='flex flex-row justify-between my-2'>
                                <label htmlFor="vehicle-id" className='py-2'>Enter your vehicle ID
                                    <span className='text-red-700 font-semibold'> *</span>
                                </label>
                                <input
                                    type='text'
                                    id="vehicle-id"
                                    name="vehicleId"
                                    className="w-1/2 py-2 my-2 border rounded-md"
                                    value={vehicleId}
                                    onChange={handleVehicleIdChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="document" className='block my-2'>Upload your vehicle registration document
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
                            <div className='h-auto'>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Next
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            ) : (
                <div className="h-screen p-20 flex flex-col w-2/3 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg">Documents Submitted</p>
                    <p className="text-lg">We will get back to you shortly!</p>
                </div>
            )}
        </div>
    );
};

export default AddDocument;

// // src/FileUpload.js


// // import React, { useState } from 'react';
// // import { useSelector } from 'react-redux';

// // const AddDocument = () => {
// //     const token = useSelector((state) => state.token);

// //     const [file, setFile] = useState(null);
// //     const [message, setMessage] = useState('');

// //     const onFileChange = (e) => {
// //         setFile(e.target.files[0]);
// //     };

// //     const onFileUpload = async () => {
// //         if (!file) {
// //             setMessage('Please select a file first!');
// //             return;
// //         }

// //         console.log(file);

// //         const formData = new FormData();
// //         formData.append('file', file);

// //         try {
// //             const response = await fetch('http://localhost:2564/upload/image', {
// //                 method: 'PUT',
// //                 body: formData, // Send FormData directly
// //                 headers: {
// //                     'Authorization': 'Bearer ' + token,
// //                 },
// //             });
// //             console.log(response);

// //             if (response.ok) {
// //                 setMessage('File uploaded successfully!');
// //             } else {
// //                 setMessage('File upload failed.');
// //             }
// //         } catch (error) {
// //             console.error('Error uploading file:', error);
// //             setMessage('Error uploading file.');
// //         }
// //     };

// //     return (
// //         <div>
// //             <h2>File Upload</h2>
// //             <input type="file" onChange={onFileChange} />
// //             <button onClick={onFileUpload}>Upload</button>
// //             <p>{message}</p>
// //         </div>
// //     );
// // };

// // export default AddDocument;


// import React, {useState} from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// function AddDocument() {

//   const [file, setFile] = useState()

//   const token = useSelector((state) => state.token)

//   function handleChange(event) {
//     setFile(event.target.files[0])
//   }
  
//   function handleSubmit(event) {
//     event.preventDefault()
//     const url = 'http://localhost:2564/upload/image';
//     const formData = new FormData();
//     formData.append('profile', file);
//     // formData.append('fileName', file.name);
//     const config = {
//       headers: {
//         'content-type': 'multipart/form-data',
//         'Authorization': `Bearer ${token}`
//       },
//     };
//     axios.put(url, formData, config).then((response) => {
//       console.log(response.data);
//     });

//   }

//   return (
//     <div className="App">
//         <form onSubmit={handleSubmit}>
//           <h1>React File Uploading</h1>
//           <input type="file" onChange={handleChange}/>
//           <button type="submit">Upload</button>
//         </form>
//     </div>
//   );
// }

// export default AddDocument;