import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';

const AddSale = () => {
    const [orderid, setOrderid] = useState('');
    const [cname, setCname] = useState('');
    const [pname, setPname] = useState('');
    const [amount, setAmount] = useState('');
    const [paystatus, setPaystatus] = useState('');
    const navigate = useNavigate();

    const Submit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("https://e-commerce-project-dashboard.onrender.com/createSale", {
                orderid: Number(orderid),
                cname,
                pname,
                amount: Number(amount),
                paystatus,
            });
            navigate('/addremovesaleitems');
        } catch (err) {
            console.error("Form submission failed:", err);
        }
    };

    return (
        <div className="flex justify-center items-center bg-gradient-to-r from-gray-100 to-green-100 px-4 pb-4 pt-8">
            <div className="backdrop-blur-lg bg-white/80 border border-gray-300 rounded-2xl px-8 py-3 w-full max-w-xl shadow-xl">
                <form className="w-full" onSubmit={Submit}>
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Sale</h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Sale ID</label>
                        <input
                            type="number"
                            placeholder="eg. 1"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setSaleid(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Order ID</label>
                        <input
                            type="number"
                            placeholder="eg. 1001"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setOrderid(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Customer Name</label>
                        <input
                            type="text"
                            placeholder="eg. Adam John"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Total Amount</label>
                        <input
                            type="number"
                            placeholder="eg. 1999"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Payment Method:</label>
                        <div className="flex gap-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Visa"
                                    className="accent-gray-600"
                                    onChange={(e) => setPaymethod(e.target.value)}
                                />
                                <span>Visa</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Mastercard"
                                    className="accent-gray-600"
                                    onChange={(e) => setPaymethod(e.target.value)}
                                />
                                <span>Mastercard</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Others"
                                    className="accent-gray-600"
                                    onChange={(e) => setPaymethod(e.target.value)}
                                />
                                <span>Others</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Payment Status</label>
                        <select
                            onChange={(e) => setPaystatus(e.target.value)}
                            defaultValue=""
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-green-200 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-300 transition"
                    >
                        <FaSave className="text-lg" />
                        <span className="font-semibold">Submit</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSale;
