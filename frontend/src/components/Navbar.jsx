import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const currentPage = location.pathname;

  const getLinkClass = (path) => {
    return currentPage === path 
      ? 'bg-red-400 py-2 px-4 rounded transition' 
      : 'hover:bg-red-400 py-2 px-4 rounded transition';
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Add API call for logout later
    logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand and Main Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 tracking-tight hover:opacity-80 transition-opacity">
            airbnb
          </Link>
          
          {isLoggedIn && user?.userType === 'guest' && (
            <ul className="hidden md:flex space-x-1">
              <li><Link to="/homes" className={currentPage === '/homes' ? 'text-red-500 font-semibold px-3 py-2 rounded-md bg-red-50/50 transition-colors' : 'text-gray-600 font-medium px-3 py-2 rounded-md hover:text-red-500 hover:bg-gray-50 transition-colors'}>Explore</Link></li>
              <li><Link to="/favourites" className={currentPage === '/favourites' ? 'text-red-500 font-semibold px-3 py-2 rounded-md bg-red-50/50 transition-colors' : 'text-gray-600 font-medium px-3 py-2 rounded-md hover:text-red-500 hover:bg-gray-50 transition-colors'}>Favourites</Link></li>
              <li><Link to="/bookings" className={currentPage === '/bookings' ? 'text-red-500 font-semibold px-3 py-2 rounded-md bg-red-50/50 transition-colors' : 'text-gray-600 font-medium px-3 py-2 rounded-md hover:text-red-500 hover:bg-gray-50 transition-colors'}>Bookings</Link></li>
            </ul>
          )}

          {isLoggedIn && user?.userType === 'host' && (
            <ul className="hidden md:flex space-x-1">
              <li><Link to="/host/host-home" className={currentPage === '/host/host-home' ? 'text-red-500 font-semibold px-3 py-2 rounded-md bg-red-50/50 transition-colors' : 'text-gray-600 font-medium px-3 py-2 rounded-md hover:text-red-500 hover:bg-gray-50 transition-colors'}>Dashboard</Link></li>
              <li><Link to="/host/add-home" className={currentPage === '/host/add-home' ? 'text-red-500 font-semibold px-3 py-2 rounded-md bg-red-50/50 transition-colors' : 'text-gray-600 font-medium px-3 py-2 rounded-md hover:text-red-500 hover:bg-gray-50 transition-colors'}>Add Home</Link></li>
            </ul>
          )}
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-3">
          {!isLoggedIn ? (
            <Link to="/login" className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-2 px-6 rounded-full shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/40 transform hover:-translate-y-0.5 transition-all duration-200">
              Log in
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-600 font-medium hover:text-red-500 transition-colors flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-red-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user.firstName?.charAt(0) || 'U'}
                </span>
                <span className="hidden sm:block">{user.firstName}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
