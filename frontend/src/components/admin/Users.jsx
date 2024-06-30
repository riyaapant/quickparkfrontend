import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';

const ViewUsers = () => {
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

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [requests, setRequests] = useState([]);
  const [viewType, setViewType] = useState('customers'); // Initially set to 'customers'
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown open/close

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/view/customer');
      setRequests(response.data.map((item) => ({ ...item, role: 'Customer' })));
    } catch (e) {
      console.log(e.response);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/view/parking');
      setRequests(response.data.map((item) => ({ ...item, role: 'Owner' })));
    } catch (e) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    if (viewType === 'customers') {
      fetchCustomers();
    } else if (viewType === 'owners') {
      fetchOwners();
    }
  }, [viewType]);

  const offset = currentPage * itemsPerPage;
  const currentItems = requests.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(requests.length / itemsPerPage);

  return (
    <main className="m-4 p-4 h-auto border-collapse border rounded-xl border-gray-300">
      <header className="pb-5 flex justify-between items-center border-b border-gray-300">
        <div>
          <p className="text-xl font-bold text-black">View Users</p>
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
          {dropdownOpen && ( // Render dropdown based on state
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={() => { setViewType('customers'); setDropdownOpen(false); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  View Customers
                </button>
                <button
                  onClick={() => { setViewType('owners'); setDropdownOpen(false); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  View Owners
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
                    <Link to="userprofile">
                      <button className="w-full justify-center rounded-md bg-black py-1 text-md font-semibold text-white shadow-sm hover:bg-qp">View</button>
                    </Link>
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
      </>
    </main>
  );
};

export default ViewUsers;
