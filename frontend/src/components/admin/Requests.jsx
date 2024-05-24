import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

const PendingRequests = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const dummyData = [
    { id: 1, name: 'John Doe', address: '1234 Elm St', role: 'Customer', date: '2024-05-01' },
    { id: 2, name: 'Jane Smith', address: '5678 Oak St', role: 'Owner', date: '2024-05-02' },
    { id: 3, name: 'Alice Johnson', address: '9101 Maple St', role: 'Owner', date: '2024-05-03' },
    { id: 4, name: 'Bob Brown', address: '1123 Pine St', role: 'Customer', date: '2024-05-04' },
    { id: 5, name: 'Charlie Davis', address: '1314 Birch St', role: 'Customer', date: '2024-05-05' },
    { id: 6, name: 'David Evans', address: '1516 Cedar St', role: 'Owner', date: '2024-05-06' },
    { id: 7, name: 'Eva Wilson', address: '1718 Spruce St', role: 'Customer', date: '2024-05-07' },
    { id: 8, name: 'Frank Harris', address: '1920 Redwood St', role: 'Customer', date: '2024-05-08' },
    { id: 9, name: 'Grace Lee', address: '2021 Sequoia St', role: 'Owner', date: '2024-05-09' },
    { id: 10, name: 'Henry Miller', address: '2223 Cypress St', role: 'Customer', date: '2024-05-10' },
  ];

  const offset = currentPage * itemsPerPage;
  const currentItems = dummyData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(dummyData.length / itemsPerPage);

  return (
    <main className="m-4 p-4 h-auto border-collapse border rounded-xl border-gray-300">
      <header className="pb-5">
        <p className="text-xl font-bold text-red-800">Pending Requests</p>
        <p className="border-b border-gray-300 leading-10">View the documents to verify these users</p>
      </header>
      <table className="table-auto w-full text-left">
        <thead className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
          <tr>
            <th className="p-2 text-base">Id</th>
            <th className="p-2 text-base">Name</th>
            <th className="p-2 text-base">Address</th>
            <th className="p-2 text-base">Role</th>
            <th className="p-2 text-base">Date</th>
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
                  {item.address}
                </div>
              </td>
              <td className="p-3">
                <div className='font-medium text-gray-800'>
                  {item.role}
                </div>
              </td>
              <td className="p-3">
                <div className='font-medium text-gray-800'>
                  {item.date}
                </div>
              </td>
              <td className="p-3">
                <div className='font-medium text-gray-800'>
                  <Link to="userprofile">
                    <button className="w-full justify-center rounded-md bg-qp py-1 text-md font-semibold text-white shadow-sm hover:bg-indigo-600">View</button>
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
    </main>
  );
};

export default PendingRequests;
