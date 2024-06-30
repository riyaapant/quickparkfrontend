import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';

const PendingRequests = () => {
  const token = useSelector((state) => state.token);

  const api = axios.create({
    baseURL: config.BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [requests, setRequests] = useState([]);
  const [viewType, setViewType] = useState('customers'); // Initially set to 'customers'
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown open/close
  const [verificationMessage, setVerificationMessage] = useState('');

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/view/pendingcustomer');
      setRequests(response.data.map((item) => ({ ...item, role: 'Customer' })));
    } catch (e) {
      console.log(e.response);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/view/pendingparking');
      console.log("pending parking: ", response)
      setRequests(response.data.map((item) => ({ ...item, role: 'Owner' })));
    } catch (e) {
      console.log(e.response);
    }
  };

  const verifyUser = async (id, role) => {
    try {
      let response;
      if (role === 'Customer') {
        response = await api.get(`admin/verify/customer/${id}`);
      } else if (role === 'Owner') {
        response = await api.get(`admin/verify/parking/${id}`);
      }
      console.log(response);
      setVerificationMessage(`User has been verified successfully.`);
      setTimeout(() => setVerificationMessage(''), 5000);
      fetchCurrentViewType();
    } catch (e) {
      console.log(e.response);
    }
  };

  const fetchCurrentViewType = () => {
    if (viewType === 'customers') {
      fetchCustomers();
    } else if (viewType === 'owners') {
      fetchOwners();
    }
  };

  useEffect(() => {
    fetchCurrentViewType();
  }, [viewType]);

  const offset = currentPage * itemsPerPage;
  const currentItems = requests.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(requests.length / itemsPerPage);

  return (
    <main className="m-4 p-4 h-auto border-collapse border rounded-xl border-gray-300">
      <header className="pb-5 flex justify-between items-center">
        <div>
          <p className="text-xl font-bold text-red-800">Pending Requests</p>
          <p className="border-b border-gray-300 leading-10">View the documents to verify these users</p>
        </div>
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="w-60 justify-center rounded-md bg-qp py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Select View : {viewType}
            </button>
          </div>
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={() => { setViewType('customers'); setDropdownOpen(false); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  View Pending Customers
                </button>
                <button
                  onClick={() => { setViewType('owners'); setDropdownOpen(false); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  View Pending Owners
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <>
        <table className="table-auto w-full text-left">
          <thead className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
            <tr>
              <th className="p-2 text-base">Id</th>
              <th className="p-2 text-base">Name</th>
              <th className="p-2 text-base">Email</th>
              <th className="p-2 text-base">Contact</th>
              <th className="p-2 text-base">Role</th>
              <th className="p-2 text-base">Document</th>
              <th className="p-2 text-base">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.id}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.name}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.email}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.contact}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.role}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    <a href={item.document} className='text-qp font-semibold hover:text-blue-700 w-auto' download>View document</a>
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    <button className="w-full justify-center rounded-md bg-black py-1 text-md font-semibold text-white shadow-sm hover:bg-qp"
                      onClick={() => verifyUser(item.id, item.role)}
                    >Verify</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center mt-4"}
          pageClassName={"mx-1"}
          pageLinkClassName={"px-3 py-1 border border-gray-300 rounded"}
          previousLinkClassName={"px-3 py-1 border border-gray-300 rounded"}
          nextLinkClassName={"px-3 py-1 border border-gray-300 rounded"}
          activeClassName={"bg-blue-500 text-white"}
        />
        
        {verificationMessage && <p className='text-green-900 font-bold text-center pt-10'>{verificationMessage}</p>}
      </>
    </main>
  );
};

export default PendingRequests;
