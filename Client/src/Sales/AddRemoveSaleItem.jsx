'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { FiSearch } from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AddRemoveSaleItem = () => {
  const [searchParams] = useSearchParams();
  const pageFromParams = parseInt(searchParams.get('page')) || 1;

  const orderid = searchParams.get('orderid');
  const name = searchParams.get('name');
  const pnameRaw = searchParams.get('products');
  const products = pnameRaw ? pnameRaw.split('|') : [];

  const [prod, setProd] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(pageFromParams);

  const prodPerPage = 9;
  const indexOfLastProd = currentPage * prodPerPage;
  const indexOfFirstProd = indexOfLastProd - prodPerPage;

  const toggleSearch = () => setSearchVisible(prev => !prev);

  const filteredProd = prod.filter((prods) =>
    prods.orderid?.toString().includes(searchTerm)
  );

  const currentProd = filteredProd.slice(indexOfFirstProd, indexOfLastProd);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('http://localhost:3001/salepage', {
          withCredentials: true,
        });

        const newOrderData = orderid ? [{
          orderid,
          name,
          products
        }] : [];

        // Only merge if orderId exists (user came from checkout)
        const combined = [...newOrderData, ...res.data];
        setProd(combined);
        console.log("✅ Sales fetched:", combined);
      } catch (err) {
        console.log("❌ Axios Error:", err.response?.data || err.message);
      }
    };

    fetchSales();
  }, []); // ✅ Runs only once to avoid infinite fetch loop

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/deleteSale/${id}`)
      .then(() => window.location.reload())
      .catch((err) => console.log("Delete Error:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4">
      <div className="max-w-6xl bg-white rounded-2xl shadow-lg p-6">
        {/* Search */}
        <div className="flex justify-end items-center gap-1 mb-3">
          <FiSearch
            onClick={toggleSearch}
            className="text-xl text-gray-400 cursor-pointer hover:text-blue-400 transition"
          />
          {searchVisible && (
            <input
              type="text"
              placeholder="Search by OrderID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          )}
        </div>

        {/* Table */}
        {prod.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 border-b">ID</th>
                  <th className="px-4 py-3 border-b">Customer Name</th>
                  <th className="px-4 py-3 border-b">Product</th>
                  <th className="px-4 py-3 border-b">Quantity</th>
                  <th className="px-4 py-3 border-b">Amount</th>
                  <th className="px-4 py-3 border-b">Payment Status</th>
                  <th className="px-4 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
  {prod.map((item, index) => {
    return item.products?.map((product, pIndex) => (
      <tr
        key={`${item._id}-${pIndex}`}
        className={`${(index + pIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}
      >
        {/* Show orderid and name only once per group using rowSpan */}
        {pIndex === 0 && (
          <>
           <td rowSpan={item.products.length} className="text-center align-middle border-r border-gray-200">
  {item.orderid?.slice(0, 4)}
</td>
            <td rowSpan={item.products.length} className="text-center align-middle border-r border-gray-200">
              {item.name}
            </td>
          </>
        )}

        {/* Product details per row */}
        <td className="text-center">{product.title}</td>
        <td className="text-center">{product.quantity}</td>
        <td className="text-center">{product.amount}</td>
        <td className="text-center">{product.paystatus}</td>

        {/* Show action buttons only once per order */}
        {pIndex === 0 && (
          <td
            rowSpan={item.products.length}
            className="text-center align-middle"
          >
            <div className="flex justify-center items-center gap-4">
              <Link
                to={`/saleUpdate/${item._id}?page=${currentPage}`}
                className="text-gray-500 hover:text-gray-600 text-lg"
                title="Update"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 hover:text-red-600 text-lg"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </td>
        )}
      </tr>
    ));
  })}
</tbody>


            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No matching items found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <ul className="flex gap-2">
            {[...Array(Math.ceil(filteredProd.length / prodPerPage))].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 py-1 rounded ${currentPage === index + 1 ? 'font-bold' : 'font-normal'
                    } hover:bg-gray-200 transition`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddRemoveSaleItem;
