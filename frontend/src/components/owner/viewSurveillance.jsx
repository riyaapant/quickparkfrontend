import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../features/config';
import { useSelector } from 'react-redux';

const ViewSurveillance = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const token = useSelector((state) => state.token)

  const api = axios.create({
    baseURL: config.BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + `${token}`
    },
  });

  const [parkingLocations, setParkingLocations] = useState([{}])
  const fetchOwnParkingLocations = async () => {
    try {
      const response = await api.get(`viewownparking`)
      console.log("own parking: ", response.data)
      setParkingLocations(response.data)
      console.log(parkingLocations)
    }
    catch (e) {
      console.log(e.response)
    }
  }


  useEffect(() => {
    fetchOwnParkingLocations()
  }, [])

  const offset = currentPage * itemsPerPage;
  const currentItems = parkingLocations.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(parkingLocations.length / itemsPerPage);

  return (
    <main className="m-4 p-10 h-auto border-collapse border rounded-xl border-gray-300">
      <header className="pb-5 flex flex-row justify-between">
        <p className="text-xl font-bold text-qp">Your Parking Locations</p>
        
      </header>
      {parkingLocations.length > 0 ? (
        <table className="table-auto w-full text-left">
          <thead className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
            <tr>
              <th className="p-2 text-base">Id</th>
              <th className="p-2 text-base">Address</th>
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
                    {item.address}
                  </div>
                </td>
                <td className="p-3">
                  <div className=' flex flex-row gap-x-2 font-medium text-gray-800'>
                    <Link to={`${item.id}`}>
                      <button className="w-auto justify-center rounded-md bg-qp py-2 px-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-600">Surveillance</button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='w-full text-center'>No parking locations to show.</div>
      )}

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

export default ViewSurveillance;
