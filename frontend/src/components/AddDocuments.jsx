import React, { useState } from 'react';

const AddDocument = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission and verification
        setIsSubmitted(true);
    };

    return (
        <div>
            {!isSubmitted ? (
                <div className="h-screen p-20 flex flex-col w-2/3">
                    <section className='h-auto'>
                        <p className='text-2xl font-bold'>Let's get you verified</p>
                        <p className='text-lg'>We will manually verify these documents to list you as a parking land owner</p>
                    </section>

                    <section className='flex-grow justify-center pt-10'>
                        <form className='flex flex-col gap-y-8' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="land-registration-document">Upload your land registration papers</label>
                                <input
                                    type='file'
                                    id="land-registration-document"
                                    name="landRegistration"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="tax-document">Upload your land tax papers</label>
                                <input
                                    type='file'
                                    id="tax-document"
                                    name="taxDocument"
                                    className="w-full"
                                />
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
