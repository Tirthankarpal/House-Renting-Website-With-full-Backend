import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function AddHome() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('editing') === 'true' || !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    houseName: '',
    Price: '',
    Location: '',
    Rating: '',
    PhotoUrl: '',
    Description: '',
  });

  useEffect(() => {
    if (user?.userType !== 'host') {
      navigate('/');
      return;
    }
    
    if (isEditing && id) {
      const fetchHomeDetails = async () => {
        try {
          const { data } = await api.get(`/host/edit-home/${id}`);
          if (data.home) {
            setFormData({
              houseName: data.home.houseName,
              Price: data.home.Price,
              Location: data.home.Location,
              Rating: data.home.Rating,
              PhotoUrl: data.home.PhotoUrl,
              Description: data.home.Description,
            });
          }
        } catch (err) {
          console.error("Failed to fetch home details", err);
        }
      };
      fetchHomeDetails();
    }
  }, [isEditing, id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.post('/host/edit-home', { _id: id, ...formData });
      } else {
        await api.post('/host/add-home', formData);
      }
      navigate('/host/host-home');
    } catch (err) {
      console.error("Failed to save home:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {isEditing ? 'Edit' : 'Add'} Your Home on AirBnB
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="houseName"
          value={formData.houseName}
          onChange={handleChange}
          placeholder="Enter your House Name"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="number"
          name="Price"
          value={formData.Price}
          onChange={handleChange}
          placeholder="Enter your House rent per night"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
          placeholder="Enter your House Location"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="number"
          step="0.1"
          name="Rating"
          value={formData.Rating}
          onChange={handleChange}
          placeholder="Enter your House rating"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="url"
          name="PhotoUrl"
          value={formData.PhotoUrl}
          onChange={handleChange}
          placeholder="Enter Photo url"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <textarea
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          placeholder="Enter your House Description"
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
        ></textarea>
        <button 
          type="submit" 
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 font-bold mt-2"
        >
          {isEditing ? 'Update Home' : 'Add Home'}
        </button>
      </form>
    </div>
  );
}

export default AddHome;
