import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
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
            'Authorization': `Bearer ${token}`,
        },
    });

    const [parkingRevenue, setParkingRevenue] = useState(0);
    const [vehiclesParked, setVehiclesParked] = useState(0);
    const [parkingLocations, setParkingLocations] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Daily Revenue (Rs.)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });

    const extractDate = (timestamp) => {
        return timestamp.split('T')[0];
    };

    const sumDailyEarnings = (data) => {
        const dailyEarningsMap = new Map();
        data.forEach(item => {
            const date = extractDate(item.Time);
            if (dailyEarningsMap.has(date)) {
                dailyEarningsMap.set(date, dailyEarningsMap.get(date) + item.Amount);
            } else {
                dailyEarningsMap.set(date, item.Amount);
            }
        });
        return Array.from(dailyEarningsMap.values());
    };

    const fetchCreditBalance = async () => {
        try {
            const response = await api.get('/view/credit');
            const filteredResponse = response.data.filter(item => item.From !== 'Khalti');
            const totalEarned = filteredResponse.reduce((sum, item) => sum + item.Amount, 0);
            const parkingTotal = filteredResponse.length;
            const dailyEarnings = sumDailyEarnings(filteredResponse);
            const dates = Array.from(new Set(filteredResponse.map(item => extractDate(item.Time))));

            setParkingRevenue(totalEarned);
            setVehiclesParked(parkingTotal);
            setChartData({
                labels: dates,
                datasets: [
                    {
                        label: 'Daily Revenue (Rs)',
                        data: dailyEarnings,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                ],
            });
        } catch (error) {
            console.log('Error fetching credit balance:', error);
        }
    };

    const fetchOwnParkingLocations = async () => {
        try {
            const response = await api.get('viewownparking');
            const filteredResponse = response.data.filter(item => item.is_paperverified == true);
            console.log(filteredResponse)
            setParkingLocations(filteredResponse);
        } catch (error) {
            console.log('Error fetching own parking locations:', error);
        }
    };

    useEffect(() => {
        fetchCreditBalance();
        fetchOwnParkingLocations();
    }, []);

    return (
        <section className="h-screen p-10 bg-gray-50">
            <div className="px-8 flex flex-col">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-qp">Welcome to QuickPark!</h2>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard value={parkingRevenue} label="Earned in revenue" type='amount' />
                    <StatCard value={vehiclesParked} label="Vehicles Parked" type='integer' />
                    <StatCard value={parkingLocations.length} label="Verified Parking Lands" type='integer' />
                </div>
                <div className="mt-10 bg-white shadow-lg rounded-lg px-5 h-fit p-10">
                    <Line data={chartData} />
                </div>
            </div>
        </section>
    );
};

const StatCard = ({ value, label, type }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-gray-900">
            {type === 'amount' ? (
                <CountUp end={value} decimals={2} duration={3} separator="," prefix="Rs " />
            ) :
                (
                    <CountUp end={value} duration={3} separator="," />
                )
            }
        </div>
        <div className="mt-2 text-sm font-medium text-gray-600">{label}</div>
    </div>
);

export default Dashboard;
