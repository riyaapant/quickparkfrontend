import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import axios from 'axios';
import config from '../../features/config';
import { setCred } from '../../features/credSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddOwnerDocument = () => {

    const dispatch = useDispatch()

    const ownerDocumentsSubmitted = useSelector((state) => state.ownerDocumentsSubmitted)
    const ownerDocumentsVerified = useSelector((state) => state.ownerDocumentsVerified)
    const custDocumentsSubmitted = useSelector((state) => state.customerDocumentsSubmitted)

    const [document, setDocument] = useState(null);

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(document)

        const ownerDocument = new FormData();
        ownerDocument.append('file', document)
        try {
            const documentUploadResponse = await api.put(`upload/owner/file`, ownerDocument, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + `${token}`
                }
            });
            console.log(documentUploadResponse);

            dispatch(setCred({
                ownerDocumentsSubmitted: true,
                ownerDocumentsVerified: true,
            }))
        } catch (error) {
            dispatch(setCred({
                ownerDocumentsSubmitted: false
            }))
            console.error('Error uploading file: ', error);
        }
    };

    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocument(file);
            console.log(file)
        }
    };

    useEffect(() => {
        console.log("owner documents submitted: ", ownerDocumentsSubmitted)
        console.log("owner documents verified: ", ownerDocumentsVerified)
        console.log("customer documents submitted: ", custDocumentsSubmitted)
    })

    return (
        <div>
            {!ownerDocumentsSubmitted ? (
                <div className="h-screen p-10 flex flex-col w-2/3">
                    <section className='h-auto'>
                        <p className='text-2xl font-bold'>Let's get you verified</p>
                        <p className='text-lg'>We will manually verify these documents to list you as a parking land owner</p>
                    </section>

                    <section className='flex-grow justify-center pt-10'>
                        <form className='flex flex-col gap-y-8 divide-y-2' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="document" className='block my-2'>Upload your land taxation document
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
                <>
                    {!ownerDocumentsVerified ? (
                        <div className="h-screen p-20 flex flex-col w-2/3 justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#qp" className="w-16 h-16">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                            <p className="text-lg">Documents Submitted</p>
                            <p className="text-lg">We will get back to you shortly!</p>
                        </div>
                    ) : (
                    <div className="h-screen p-20 flex flex-col w-2/3 justify-center items-center">
                            <ThumbsUp className='w-24 h-24'/>
                            <p className="text-lg font-semibold">Congratulations!</p>
                            <p className="text-lg">You have been verified.</p>
                        </div>
                    )
                    }
                </>

            )}
        </div>
    );
};

export default AddOwnerDocument;