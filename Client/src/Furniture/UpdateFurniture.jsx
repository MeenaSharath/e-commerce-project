import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const UpdateFurniture = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.state?.currentPage || 1;

  useEffect(() => {
    axios.get(`http://localhost:3001/getProd/${id}`)
      .then(result => {
        setName(result.data.name);
        setPrice(result.data.price);
        setStock(result.data.stock);
        setRating(result.data.rating);
        setImageUrl(result.data.image);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "imageupload1");
    formData.append("cloud_name", "degumncul");

    const res = await axios.post("https://api.cloudinary.com/v1_1/degumncul/image/upload", formData);
    return res.data.secure_url;
  };

  const Update = async (e) => {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    if (image) {
      try {
        finalImageUrl = await handleImageUpload(image);
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      }
    }

    axios.put(`http://localhost:3001/updateProduct/${id}`, {
      name,
      price: Number(price),
      rating: Number(rating),
      stock: Number(stock),
      image: finalImageUrl
    })
      .then(() => navigate(`/addremoveitems?page=${currentPage}`))
      .catch(err => console.log(err));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-purple-100 to-blue-200 px-4 pt-8 pb-8">
      <div className="bg-white/90 backdrop-blur rounded-xl px-8 py-3 w-full max-w-xl shadow-lg border border-gray-200">
        <form onSubmit={Update} className="w-full space-y-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Update Product</h3>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-gray-700 font-medium mb-1">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Image</label>
            {imageUrl ? (
              <img src={imageUrl} alt="Current" className="w-24 h-24 object-cover rounded-md border border-gray-300 shadow-sm" />
            ) : (
              <p className="text-gray-500 italic">No image available</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Change Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-md border border-dashed border-orange-400" />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-200 hover:bg-blue-300 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200"
          >
            <FaEdit />
            <span className="font-semibold">Update Product</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateFurniture;
