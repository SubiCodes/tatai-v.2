// Change your ProtectedRoute to check authentication differently
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { MoonLoader } from 'react-spinners';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URI}/api/v1/authAdmin/cookie`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return (
        <div className='w-screen h-screen flex flex-col items-center justify-center gap-12 '>
            <span className='text-2xl font-bold'>Logging in</span>
            <MoonLoader size={48}/>
        </div>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;