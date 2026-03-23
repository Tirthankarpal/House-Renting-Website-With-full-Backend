import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'guest',
    terms: false
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in py-12">
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-red-900/5 p-8 sm:p-10 border border-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create an account</h2>
          <p className="text-gray-500">Join airbnb to book or host amazing homes.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1" htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-sm"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1" htmlFor="userType">I am signing up as a...</label>
             <div className="flex flex-col sm:flex-row gap-3 mt-2">
               <label className={`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.userType === 'guest' ? 'border-red-500 bg-red-50/50 text-red-700 ring-1 ring-red-500' : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-50'}`}>
                 <input
                   type="radio"
                   name="userType"
                   value="guest"
                   checked={formData.userType === 'guest'}
                   onChange={handleChange}
                   className="w-4 h-4 text-red-600 focus:ring-red-500"
                 />
                 <span className="ml-3 font-medium text-sm text-gray-900">Guest <span className="text-xs text-gray-500 font-normal block">Book amazing homes</span></span>
               </label>
               <label className={`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.userType === 'host' ? 'border-red-500 bg-red-50/50 text-red-700 ring-1 ring-red-500' : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-50'}`}>
                 <input
                   type="radio"
                   name="userType"
                   value="host"
                   checked={formData.userType === 'host'}
                   onChange={handleChange}
                   className="w-4 h-4 text-red-600 focus:ring-red-500"
                 />
                 <span className="ml-3 font-medium text-sm text-gray-900">Host <span className="text-xs text-gray-500 font-normal block">List your property</span></span>
               </label>
             </div>
          </div>

          <div className="flex items-start mt-6 pt-4 border-t border-gray-100">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
              className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 transition cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
              I agree to the <a href="#" className="text-red-500 hover:text-red-600 hover:underline">Terms of Service</a> and <a href="#" className="text-red-500 hover:text-red-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-red-500 hover:text-red-600 hover:underline transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
