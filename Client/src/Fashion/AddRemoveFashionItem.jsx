import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Rating from '@mui/material/Rating';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { BiExport } from 'react-icons/bi';

const AddRemoveFashionItem = () => {
  const [prod, setProd] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => setSearchVisible((prev) => !prev);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportMenuVisible, setExportMenuVisible] = useState(false);
  const dropdownRef = useRef(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromParams = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromParams);

  const prodPerPage = 6;
  const indexOfLastProd = currentPage * prodPerPage;
  const indexOfFirstProd = indexOfLastProd - prodPerPage;

  useEffect(() => {
    axios.get('https://e-commerce-project-dashboard.onrender.com/categories/fashion')
      .then(result => setProd(result.data))
      .catch(err => console.log(err));

      // Outside click handler for export dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setExportMenuVisible(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  // Cleanup
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const filteredProd = prod.filter((prods) =>
    prods.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentProd = filteredProd.slice(indexOfFirstProd, indexOfLastProd);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    setSearchParams({ page: pageNum });
  };

  const handleDelete = (id) => {
    axios.delete(`https://e-commerce-project-dashboard.onrender.com/categories/fashion/${id}`)
      .then(() => window.location.reload())
      .catch(err => console.log(err));
  };

  const exportToExcel = () => {
    const selectedData = currentProd.map(item => ({
      Name: item.name,
      Price: item.price,
      Stock: item.stock
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Columns');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'fashion-products.xlsx');
  };
  
  const exportToPDF = () => {
    let htmlContent = `
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th></tr>
        </thead>
        <tbody>
          ${currentProd.map(item =>
            `<tr><td>${item.name}</td><td>₹${item.price}</td><td>${item.stock}</td></tr>`
          ).join('')}
        </tbody>
      </table>
    `;
  
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    html2pdf().from(element).save('fashion-products.pdf');
  };
  
  const exportToWord = () => {
    let htmlContent = `
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th></tr>
        </thead>
        <tbody>
          ${currentProd.map(item =>
            `<tr><td>${item.name}</td><td>&#8377;${item.price}</td><td>${item.stock}</td></tr>`
          ).join('')}
        </tbody>
      </table>
    `;
  
    const blob = new Blob(['<html><body>' + htmlContent + '</body></html>'], {
      type: 'application/msword'
    });
    saveAs(blob, 'fashion-products.doc');
  };
  

  return (
    <div className="min-h-screen bg-gray-100 py-3 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5">

        {/* Top controls */}
        <div className="flex justify-end items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <FiSearch
              onClick={toggleSearch}
              className="text-xl text-gray-400 cursor-pointer hover:text-blue-400 transition"
            />
            {searchVisible && (
              <input
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            )}
          </div>
        <div ref={dropdownRef} >
                  <button
          type="button"
          onClick={() => setExportMenuVisible((prev) => !prev)}
          className="text-xl text-gray-400 cursor-pointer hover:text-blue-400 transition"
          title="Export"
        >
          <BiExport />
        </button>
          {exportMenuVisible && (
            <div
              className="origin-top-right absolute right-0 mt-1 w-25 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <button onClick={exportToExcel} className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 w-25 text-left">
                  Excel
                </button>
                <button onClick={exportToPDF} className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 w-25 text-left">
                  PDF
                </button>
                <button onClick={exportToWord} className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 w-25 text-left">
                  Word
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Table */}
        {currentProd.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Rating</th>
                  <th className="px-4 py-2 border-b">Stock</th>
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProd.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}
                  >
                    <td className="py-1 px-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="Product"
                          className="w-20 h-16 mx-auto rounded-md shadow"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="text-center">{item.name}</td>
                    <td className="text-center">
                      <Rating name="size-medium" value={item.rating} readOnly />
                    </td>
                    <td className="text-center font-semibold">{item.stock}</td>
                    <td className="text-center font-semibold">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center items-center gap-4">
                        <Link
                          to={`/fashionUpdate/${item._id}`}
                          state={{ currentPage }}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No matching items found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-3">
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

export default AddRemoveFashionItem;
