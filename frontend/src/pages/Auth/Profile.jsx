import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Profile() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Name</p>
          <p className="text-xl font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
        </div>
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Email</p>
          <p className="text-xl font-semibold text-gray-900">{user?.email}</p>
        </div>
        <div className="border-b pb-4">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Account Type</p>
          <p className="text-xl font-semibold text-gray-900 capitalize">{user?.userType}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
