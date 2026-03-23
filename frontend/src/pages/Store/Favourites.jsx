import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Favourites() {
  const [favHomes, setFavHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'guest') {
      navigate('/');
      return;
    }

    const fetchFavourites = async () => {
      try {
        const { data } = await api.get('/favourites');
        setFavHomes(data.favHomes || []);
      } catch (err) {
        console.error('Failed to fetch favourites', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [user, navigate]);

  const handleRemove = async (homeId) => {
    try {
      await api.post(`/favourites/delete/${homeId}`);
      setFavHomes(prev => prev.filter(h => h._id !== homeId));
    } catch (err) {
      console.error('Failed to remove favourite', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading your favourites...</div>;

  return (
    <div className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-4xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
        Here are your favourite homes:
      </h2>
      
      {favHomes.length > 0 ? (
        <ul className="space-y-8">
          {favHomes.map((home) => (
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
                  onClick={() => handleRemove(home._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold w-full md:w-auto self-start"
                >
                  Remove from Favourites
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">You haven't added any favourites yet.</p>
      )}
    </div>
  );
}

export default Favourites;
