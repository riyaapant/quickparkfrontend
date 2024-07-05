import React from 'react';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../features/config';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const token = useSelector((state) => state.token);

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`,
        },
    });

    const [earning, setEarning] = useState([]);
    const [parkingRevenue, setParkingRevenue] = useState(0);
    const [customerReached, setCustomersReached] = useState(0);
    const [parkingLocations, setParkingLocations] = useState([{}])
    // const [chartData, setChartData] = useState({
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //     datasets: [
    //         {
    //             label: 'Revenue',
    //             data: [300, 500, 100, 400, 700, 200, 900],
    //             borderColor: 'rgba(75, 192, 192, 1)',
    //             backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //         },
    //     ],
    // });

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Revenue',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });

    const extractDate = (timestamp) => {
        return timestamp.split('T')[0];
    };

    const fetchCreditBalance = async () => {
        try {
            const response = await api.get(`/view/credit`);
            // console.log("view credit:", response.data)
            const filteredResponse = response.data.filter(item => item.From !== 'Khalti');
            const earnedAmount = filteredResponse.reduce((sum, item) => sum + item.Amount, 0);
            const customersTotal = filteredResponse.length;
            console.log("filteredResponse: ", filteredResponse)
            setEarning(filteredResponse);
            setParkingRevenue(earnedAmount);
            setCustomersReached(customersTotal);
            const times = filteredResponse.map(item => extractDate(item.Time));
            const amounts = filteredResponse.map(item => item.Amount);
            // const dailyAmount = []
            // amounts.forEach(amounts => {
            //     if(!)
            // })
            setChartData({
                labels: times,
                datasets: [
                    {
                        label: 'Revenue',
                        data: amounts,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                ],
            })

        } catch (e) {
            console.log(e);
        }
    };

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
        fetchCreditBalance();
        fetchOwnParkingLocations()
    }, []);

    return (
        <section className="h-screen p-10 bg-gray-50">
            <div className="px-8 flex flex-col">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-qp">Welcome to QuickPark!</h2>
                    {/* <p className="mt-2 text-lg text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing possimus.</p> */}
                </div>
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            <CountUp end={parkingRevenue} decimals={2} duration={3} separator="," prefix="Rs " />
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
                            <CountUp end={parkingLocations.length} duration={3} />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-600">Parking lands</div>
                    </div>
                </div>
                <div className="mt-10 bg-white shadow-lg rounded-lg px-5 h-80 w-auto">
                    <Line className='h-80' data={chartData} />
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
