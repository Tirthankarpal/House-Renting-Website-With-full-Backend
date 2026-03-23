import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Home() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const { data } = await api.get('/homes');
        setHomes(data.registeredHomes || []);
      } catch (err) {
        console.error("Failed to fetch homes:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomes();
  }, []);

  if (loading) return <div className="text-center py-10">Loading homes...</div>;

  return (
    <div className="py-8">
      <section className="bg-white/60 backdrop-blur-lg shadow-xl shadow-red-900/5 ring-1 ring-gray-900/5 rounded-3xl p-8 md:p-12 max-w-7xl mx-auto border border-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 tracking-tight mb-4">
            Find your next stay
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Discover beautiful homes, handpicked just for you.</p>
        </div>

        {homes.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {homes.map((home, index) => (
              <div 
                key={home._id} 
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={home.PhotoUrl.startsWith('http') ? home.PhotoUrl : '/' + home.PhotoUrl}
                    alt={home.houseName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                    <span className="text-yellow-500">★</span> {home.Rating}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{home.houseName}</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {home.Location}
                    </p>
                    <p className="text-lg mb-6">
                      <span className="font-bold text-gray-900">₹{home.Price}</span>
                      <span className="text-gray-500 text-sm font-medium"> / night</span>
                    </p>
                  </div>

                  <Link
                    to={`/homes/${home._id}`}
                    className="block w-full text-center bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="text-6xl mb-4">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No homes available</h3>
            <p className="text-gray-500">Check back later or try adjusting your search parameters.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
