import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Auth/Profile';
import Home from './pages/Store/Home';
import HomeDetails from './pages/Store/HomeDetails';
import Favourites from './pages/Store/Favourites';
import Bookings from './pages/Store/Bookings';
import AddHome from './pages/Host/AddHome';
import HostDashboard from './pages/Host/HostDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 font-sans text-gray-900 selection:bg-red-200 selection:text-red-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/homes" element={<Home />} />
            <Route path="/homes/:id" element={<HomeDetails />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/host/add-home" element={<AddHome />} />
            <Route path="/host/edit-home/:id" element={<AddHome />} />
            <Route path="/host/host-home" element={<HostDashboard />} />
          </Routes>
        </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
