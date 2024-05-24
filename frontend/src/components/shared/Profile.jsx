import { useState } from 'react';
import { Paperclip } from 'lucide-react';

export default function Profile() {
    const [verified, setVerified] = useState(true);

    return (
        <section className="max-h-screen m-4 p-4 border-collapse border rounded-xl border-gray-300 flex flex-col">
            <p className="text-xl font-bold text-gray-800">User Information</p>

            <div className="pt-8 flex-grow flex flex-row">
                <div className="w-1/3 grid grid-rows-6 pr-5 gap-y-10 ">
                    <div className='row-span-3 flex justify-center'>
                        <img
                            className="w-auto h-full"
                            src="https://via.placeholder.com/150"
                            alt="Applicant"
                        />
                    </div>
                    <div>Status: {verified ? 'Verified' : 'Verification Pending'}</div>
                </div>


                <div className="flex-grow divide-y">
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">John Doe</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">johndoe123@gmail.com</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">Balkumari, Lalitpur</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Role</dt>
                        <dd className="mt-1 text-lg text-gray-700 sm:col-span-2 sm:mt-0">Customer</dd>
                    </div>
                    <div className="px-2 py-6 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
                        <dt className="text-lg font-medium text-gray-500">Attachments</dt>
                        <dd className='mt-1 text-lg text-gray-700 sm:col-span-2 border-collapse border rounded-xl border-gray-300 px-2 py-5'>
                            <div className='flex flex-row gap-x-2 pb-2'>
                                <Paperclip className='w-auto' />
                                <p className='flex-grow truncate'>Land_Registration_Paper.png</p>
                                <button className='text-qp hover:text-blue-700 w-auto'>Download</button>
                            </div>
                            <div className='flex flex-row gap-x-2 pt-2'>
                                <Paperclip className='w-auto' />
                                <p className='flex-grow truncate'>Land_Tax_Payment_Paper_2017_02_03.png</p>
                                <button className='text-qp hover:text-blue-700 w-auto'>Download</button>
                            </div>
                        </dd>
                    </div>
                </div>
            </div>
        </section>
    );
}
