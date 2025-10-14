import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAdminData } from '../../../store/admin.store.jsx';
import { MoonLoader } from 'react-spinners';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URI}/api/v1/authAdmin/cookie`,
          { credentials: 'include' }
        );

        if (response.ok) {
          await getAdminData();
          setIsAuthenticated(true);
        } else if (response.status === 401 || response.status === 403) {
          console.warn('[AUTH PROTECT] 🚫 Unauthorized, redirecting to /');
          // Optional: small delay so UI updates before navigation
          setTimeout(() => navigate('/', { replace: true }), 100);
        } else {
          console.error('[AUTH PROTECT] Unexpected response:', response.status);
          setTimeout(() => navigate('/', { replace: true }), 100);
        }
      } catch (error) {
        console.error('[AUTH PROTECT] Auth check failed:', error);
        setTimeout(() => navigate('/', { replace: true }), 100);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-12">
        <span className="text-2xl font-bold">Checking authentication...</span>
        <MoonLoader size={48} />
      </div>
    );
  }

  // Only render Outlet if authenticated
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
