import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Bookings() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'guest') {
      navigate('/');
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings');
        setHomes(data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const handleCancel = async (homeId) => {
    try {
      await api.post('/bookings/delete', { homeId });
      setHomes(prev => prev.filter(h => h._id !== homeId));
    } catch (err) {
      console.error('Failed to cancel booking', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading your bookings...</div>;

  return (
    <div className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-4xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
        Here are your Booked homes:
      </h2>
      
      {homes.length > 0 ? (
        <ul className="space-y-8">
          {homes.map((home) => (
            <li key={home._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col md:flex-row overflow-hidden border border-gray-100">
              <img 
                src={home.PhotoUrl?.startsWith('http') ? home.PhotoUrl : '/' + home.PhotoUrl} 
                alt={home.houseName} 
                className="w-full md:w-64 h-56 object-cover"
              />
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{home.houseName}</h3>
                  <p className="text-gray-700 mb-1"><span className="font-semibold text-gray-900">Location: </span>{home.Location}</p>
                  <p className="text-gray-700 mb-1"><span className="font-semibold text-gray-900">Price: </span>₹{home.Price}</p>
                  <p className="text-yellow-500 font-semibold mb-2"><span className="font-semibold text-gray-900">Rating: </span>{home.Rating}/5</p>
                </div>
                
                <button 
                  onClick={() => handleCancel(home._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold w-full md:w-auto self-start"
                >
                  Cancel Booking
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">You haven't booked any homes yet.</p>
      )}
    </div>
  );
}

export default Bookings;
