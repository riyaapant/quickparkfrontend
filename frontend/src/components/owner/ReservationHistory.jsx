import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../features/config';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ReservationHistory = () => {
  const { id } = useParams()

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

  const [parkingInfo, setParkingInfo] = useState({})
  const fetchParkingInfo = async () => {
    try {
      const response = await api.get(`viewownparking`)
      response.data.map(item => {
        if (item.id == id) {
          setParkingInfo(item)
        }
      })
    }
    catch (e) {
      console.log(e.response)
    }
  }

  const [history, setHistory] = useState([{}])
  const fetchParkingHistory = async () => {
    try {
      const response = await api.get(`view/parking/reservation/${id}`)
      console.log(response.data)
      const responseItem = response.data.map(item => {
        const startDate = new Date(item.start_time);
        const endDate = new Date(item.end_time);
        const durationInSeconds = (endDate - startDate) / 1000;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        item.Time = `${minutes} minutes ${seconds} seconds`;
        return item;
      }).reverse();

      setHistory(responseItem);
    }
    catch (e) {
      console.log(e.response)
    }
  }


  useEffect(() => {
    fetchParkingInfo()
    fetchParkingHistory()
  }, [])

  const offset = currentPage * itemsPerPage;
  const currentItems = history.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(history.length / itemsPerPage);

  return (
    <main className="m-4 p-10 h-auto border-collapse border rounded-xl border-gray-300">
      <header className="pb-5 flex flex-row justify-between">
        <p className="text-xl font-bold text-qp">History: {parkingInfo.address}</p>
        <div className='font-medium text-gray-800 flex gap-x-3'>
        </div>
      </header>
      {history.length > 0 ? (
        <table className="table-auto w-full text-left">
          <thead className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
            <tr>
              <th className="p-2 text-base">Id</th>
              <th className="p-2 text-base">User</th>
              <th className="p-2 text-base">Time</th>
              <th className="p-2 text-base">Amount</th>

            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {index + 1}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.address}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    {item.Time}
                  </div>
                </td>
                <td className="p-3">
                  <div className='font-medium text-gray-800'>
                    Rs. {item.total_amount}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='w-full text-center'>No parking history to show.</div>
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
      <div className='text-center mt-3'>
        <Link to={-1}>
          <button className="w-auto justify-center rounded-md bg-qp py-2 px-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-600">Back</button>
        </Link>
      </div>
    </main>
  );
};

export default ReservationHistory;
