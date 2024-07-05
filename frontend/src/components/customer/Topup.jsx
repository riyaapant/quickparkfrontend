import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import config from "../../features/config";
import axios from "axios";
import KhaltiLogo from '../../media/khaltilogo.svg';
import { useLocation } from 'react-router-dom';

export default function Topup() {
    const token = useSelector((state) => state.token);

    const location = useLocation();

    const api = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`
        },
    });

    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("")

    const [txnMessage, setTxnMessage] = useState({
        message: '',
        status: ''
    })

    function handleAmountChange(e) {
        setAmount(e.target.value);
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/topup', {
                amount: amount
            });
            if (response.data.payment_url) {
                window.location.href = response.data.payment_url;
            }
            console.log("/topup response: ",response.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const fetchProfile = async ()   => {
            try {
                const response = await api.get(`/profile`);
                setBalance(response.data.balance);
            } catch (error) {
                console.log(error);
            }
        };

        const verifyTopup = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const transactionPidx = urlParams.get('pidx');
            if (transactionPidx) {
                try {
                    const reponse = await api.put(`/topup/verify`, {
                        pidx: transactionPidx
                    })
                    console.log("/topup/verify response: ",reponse)
                } catch (e) {
                    console.log(e)
                }
            }

        }

        fetchProfile();
        verifyTopup();

        if (location.state) {
            setTxnMessage({
                message: location.state.message,
                status: location.state.status
            });
        }
    }, []);

    return (
        <section className="max-h-screen w-max-screen m-4 p-4 flex flex-col gap-y-10">
            <div className="flex flex-row">

                <div className="flex flex-col items-center w-80">
                    <img src={KhaltiLogo} alt="khalti-logo" className="h-52 w-auto" />
                    <span className="text-xl">
                        Your balance: {balance}
                    </span>
                </div>
                <div className='flex flex-col justify-center items-center p-10 bg-slate border rounded-md shadow-md w-auto text-center h-72'>
                    <form className="flex flex-col gap-y-5 w-full text-left" onSubmit={handleFormSubmission}>

                        <div>
                            <label htmlFor="khalti-amount" className="text-gray-900 block">Amount to Load</label>
                            <input id="khalti-amount" name="khalti-amount" type="number" min={0} required placeholder="Rs. 0.00"
                                className="border-2 rounded-md p-1 mt-2 block w-full"
                                onChange={handleAmountChange}
                                value={amount}
                            />
                        </div>
                        <div className="flex flex-col gap-y-5">
                            <button type="submit" className='p-3 rounded-md bg-qp text-md font-semibold text-white hover:bg-indigo-800'>
                                Load Amount
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {txnMessage.message && (
                <p className={`text-lg font-bold text-center ${txnMessage.status === 200 ? 'text-green-700' : 'text-red-900'}`}>
                    {txnMessage.message}
                </p>
            )}
        </section>
    );
}
