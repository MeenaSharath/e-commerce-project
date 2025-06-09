import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const UpdateSale = () => {
  const { id } = useParams();
  const [orderid, setOrderid] = useState('');
  const [name, setName] = useState('');
  const [products, setProducts] = useState([{ title: '', quantity: 0, amount: 0, paystatus: '' }]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.state?.currentPage || 1;

  useEffect(() => {
    axios.get(`https://e-commerce-project-dashboard.onrender.com/getSale/${id}`)
      .then(res => {
        setOrderid(res.data.orderid || '');
        setName(res.data.name || '');
        setProducts(res.data.products || []);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = field === 'title' ? value : field === 'paystatus' ? value : Number(value);
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([...products, { title: '', quantity: 0, amount: 0, paystatus: '' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://e-commerce-project-dashboard.onrender.com/updateSale/${id}`, {
      orderid,
      name,
      products,
    })
      .then(() => navigate(`/addremovesaleitems?page=${currentPage}`))
      .catch(err => console.log(err));
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-green-100 to-gray-200 px-4 pt-8 pb-8">
      <div className="bg-white/90 backdrop-blur rounded-xl px-8 py-3 w-full max-w-2xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Update Sale</h3>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Order ID</label>
            <input
              type="text"
              value={orderid}
              onChange={(e) => setOrderid(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Products</label>
            {products.map((product, index) => (
              <div key={index} className="border p-3 mb-4 rounded-lg bg-gray-50 relative">
                <input
                  type="text"
                  placeholder="Product Title"
                  value={product.title}
                  onChange={(e) => handleProductChange(index, 'title', e.target.value)}
                  className="w-full mb-2 border rounded px-3 py-1"
                />
                <div className="flex gap-4 mb-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    className="w-1/2 border rounded px-3 py-1"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={product.amount}
                    onChange={(e) => handleProductChange(index, 'amount', e.target.value)}
                    className="w-1/2 border rounded px-3 py-1"
                  />
                </div>
                <select
                  value={product.paystatus}
                  onChange={(e) => handleProductChange(index, 'paystatus', e.target.value)}
                  className="w-full border rounded px-3 py-1"
                >
                  <option value="" disabled>Select Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <FaEdit />
            <span className="font-semibold">Update Sale</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSale;
