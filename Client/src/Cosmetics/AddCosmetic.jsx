import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';

const AddCosmetic = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();

    if (!name || !price || !rating || (!image && !imageUrl)) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      let uploadedImageUrl = imageUrl;

      // Upload to Cloudinary if no direct imageUrl provided
      if (!imageUrl && image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "imageupload1");
        formData.append("cloud_name", "degumncul");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/degumncul/image/upload",
          formData
        );
        uploadedImageUrl = res.data.secure_url;
      }

      // ✅ Use Render backend URL
      await axios.post("https://e-commerce-project-dashboard.onrender.com/createCos", {
        name,
        price: Number(price),
        rating: Number(rating),
        stock: Number(stock),
        image: uploadedImageUrl || ""
      });

      navigate('/addremovecositems');
    } catch (err) {
      alert("Image upload or form submission failed.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 px-4 pt-4">
      <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-2xl p-8 w-full max-w-xl shadow-xl">
        <form onSubmit={Submit} className="space-y-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-3">Add New Product</h3>

          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              id="name"
              type="text"
              placeholder="eg. Lipstick"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-semibold mb-1">Price (₹)</label>
            <input
              id="price"
              type="number"
              placeholder="eg. 29"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Stock</label>
            <input
              type="number"
              placeholder="eg. 100"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-gray-700 font-semibold mb-1">Rating (1–5)</label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              placeholder="eg. 4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-gray-700 font-semibold mb-1">Upload Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-600"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-200 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-pink-300 transition"
          >
            <FaSave />
            <span className="font-semibold">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCosmetic;
