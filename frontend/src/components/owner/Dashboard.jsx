import React from 'react';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';

const Dashboard = () => {

    const token = useSelector((state) => state.token)

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [earning, setEarning] = useState([])
    const [parkingRevenue, setParkingRevenue] = useState(0)
    const [customerReached, setCustomersReached] = useState(0)
    const fetchCreditBalance = async () => {
        try {
            const response = await api.get(`/view/credit`)
            // console.log(response.data)
            const filteredResponse = response.data.filter(item => item.From !== 'Khalti')
            const earnedAmount = filteredResponse.reduce((sum, item) => sum + item.Amount, 0)
            const customersTotal = filteredResponse.length;
            setEarning(filteredResponse)
            setParkingRevenue(earnedAmount)
            setCustomersReached(customersTotal)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        console.log("earning: ", earning)
        fetchCreditBalance()
    }, [])

    return (
        <section className="h-screen p-10 bg-gray-50">
            <div className="px-8">
                {/* <div className="text-center">
          <h2 className="text-3xl font-bold text-qp">Welcome to QuickPark!</h2>
          <p className="mt-2 text-lg text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing possimus.</p>
        </div> */}
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            <CountUp end={parkingRevenue} decimals={2} duration={3} separator="," prefix='Rs ' />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-600">Earned in revenue</div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            <CountUp end={customerReached} duration={3} separator="," />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-600">Customers Reached</div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            <CountUp end={3} duration={3} />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-600">Parking lands</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
