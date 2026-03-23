import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function HomeDetails() {
  const { id } = useParams();
  const [home, setHome] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeDetails = async () => {
      try {
        const { data } = await api.get(`/homes/${id}`);
        setHome(data.home);
        setRazorpayKey(data.razorpayKey);
      } catch (err) {
        console.error('Failed to fetch home details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeDetails();
  }, [id]);

  const handleCheckout = async () => {
    try {
      if (!home.Price) return alert('Invalid price');

      const createResp = await api.post('/payment/create-order', {
        amount: home.Price,
        homeId: home._id
      });
      const order = createResp.data.order;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'House Renting',
        description: 'Booking payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResp = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              homeId: home._id
            });
            if (verifyResp.data.success) {
              navigate('/bookings');
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            alert('Verification failed');
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user ? user.email : ''
        },
        theme: { color: '#ef4444' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed');
    }
  };

  const handleAddFavourite = async () => {
    try {
      await api.post('/favourites', { id: home._id });
      alert('Added to favourites!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to favourites');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/homes/${home._id}/review`, { comment: reviewText });
      setReviewText('');
      // Optimistically reload
      const { data } = await api.get(`/homes/${id}`);
      setHome(data.home);
    } catch (err) {
      alert('Failed to add review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.post(`/homes/${home._id}/review/${reviewId}/delete`);
      setHome(prev => ({ ...prev, reviews: prev.reviews.filter(r => r._id !== reviewId) }));
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (loading) return <div className="text-center py-10">Loading details...</div>;
  if (!home) return <div className="text-center py-10 text-xl font-semibold">Home not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        {/* Header Image Area */}
        <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900 group">
          <img 
            src={home.PhotoUrl?.startsWith('http') ? home.PhotoUrl : '/' + home.PhotoUrl}
            alt={home.houseName}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-sm font-medium mb-4">
                  {home.Location}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  {home.houseName}
                </h1>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-center min-w-[120px]">
                <div className="text-sm font-medium text-gray-300 mb-1">Price per night</div>
                <div className="text-3xl font-bold">₹{home.Price}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-8 md:p-12">
          
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                About this space
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                {home.Description}
              </p>
            </section>

            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl font-bold shadow-inner">
                 {home.Rating}
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900">Guest favorite</h3>
                 <p className="text-gray-500">One of the most loved homes on airbnb, according to guests.</p>
               </div>
            </section>
          </div>

          <aside className="space-y-8">
            {/* Action Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg shadow-gray-200/50 sticky top-24">
              
              {user && user.userType === 'guest' ? (
                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Reserve Now
                  </button>
                  <button
                    onClick={handleAddFavourite}
                    className="w-full bg-white text-gray-800 border-2 border-gray-200 py-3 px-6 rounded-xl font-semibold hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Save to Favourites
                  </button>
                </div>
              ) : !isLoggedIn ? (
                <button 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300"
                >
                  Log in to reserve
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                  <p className="text-gray-600 font-medium">Hosts cannot reserve homes.</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
                <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {home.reviews?.length > 0 ? home.reviews.map(review => (
                    <li key={review._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs uppercase">
                          {review.username?.charAt(0) || 'U'}
                        </div>
                        <p className="font-bold text-gray-900 text-sm">{review.username}</p>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      {user?._id === review.user?._id && (
                        <button 
                          onClick={() => handleDeleteReview(review._id)}
                          className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600 transition"
                        >
                          Delete Review
                        </button>
                      )}
                    </li>
                  )) : <p className="text-gray-500 text-sm italic">No reviews yet. Be the first!</p>}
                </ul>

                {user && user.userType === 'guest' && (
                  <form onSubmit={handleAddReview} className="mt-4 pt-4 border-t border-gray-100">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience..."
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-white resize-none h-24 text-sm transition-all"
                    ></textarea>
                    <button 
                      type="submit"
                      className="mt-2 w-full bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-800 transition"
                    >
                      Post Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default HomeDetails;
