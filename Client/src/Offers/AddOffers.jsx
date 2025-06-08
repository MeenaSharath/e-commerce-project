import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';

const AddOffers = () => {
    const [name, setName] = useState('');
    const [des, setDes] = useState('');
    const [price, setPrice] = useState('');
    const [off, setOff] = useState('');
    const [rating, setRating] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    const Submit = async (e) => {
        e.preventDefault();

        let finalImageUrl = imageUrl;

    if (!imageUrl && image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "imageupload1");
      formData.append("cloud_name", "degumncul");

      try {
        const res = await axios.post("https://api.cloudinary.com/v1_1/degumncul/image/upload", formData);
        finalImageUrl = res.data.secure_url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    try {
      await axios.post("http://localhost:3001/createOffers", {
        name,
        des,
        price: Number(price),
        off: Number(off),
        rating: Number(rating),
        image: finalImageUrl || ''
      });
      navigate('/addremoveoffersitems');
    } catch (err) {
      console.error("Form submission failed:", err);
    }
  };

    return (
        <div className="flex justify-center items-center bg-gradient-to-r from-gray-100 to-orange-100 px-4 pt-6 pb-4">
            <div className="backdrop-blur-lg bg-white/80 border border-gray-300 rounded-2xl p-8 w-full max-w-xl shadow-xl">
                <form className="w-full" onSubmit={Submit}>
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-3">Add New Product</h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
                        <input
                            type="text"
                            placeholder="eg. Lipstick"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Description</label>
                        <input
                            type="text"
                            placeholder="eg. Matte Lipstick - A6 First Love"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setDes(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Price</label>
                        <input
                            type="number"
                            placeholder="eg. 1999"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                     <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Offer</label>
                        <input
                            type="number"
                            placeholder="eg. 50"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setOff(e.target.value)}
                        />
                    </div>   

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Rating</label>
                        <input
                            type="number"
                            placeholder="eg. 4"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                            onChange={(e) => setRating(e.target.value)}
                        />
                    </div>   

                    <div className="mb-4">
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
                        className="w-full bg-orange-200 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-300 transition"
                    >
                        <FaSave className="text-lg" />
                        <span className="font-semibold">Submit</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddOffers;
