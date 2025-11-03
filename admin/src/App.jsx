import './App.css'

import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/util/ProtectedRoute.jsx';
import Layout from './components/util/Layout.jsx';
import Login from './components/Pages/Login.jsx';
import ResetPassword from './components/subpages/ResetPassword.jsx';
import Dashboard from './components/Pages/Dashboard.jsx';
import Users from './components/Pages/Users.jsx';
import ViewUser from './components/subpages/ViewUser.jsx';
import Settings from './components/Pages/Settings.jsx';
import Guides from './components/Pages/Guides.jsx';
import AddGuide from './components/subpages/AddGuide.jsx';
import EditGuide from './components/subpages/EditGuide.jsx';
import Feedbacks from './components/Pages/Feedbacks.jsx';
import Reports from './components/Pages/Reports.jsx';

import axios from 'axios';
import { X } from "lucide-react";

function App() {

  // Set global defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'https://tatai-v2-production-63ac.up.railway.app';

  const [position, setPosition] = useState("top-right");

  useEffect(() => {
    function updatePosition() {
      if (window.innerWidth >= 768) {
        setPosition("bottom-right"); // md and up
      } else {
        setPosition("top-right"); // small devices
      }
    }

    updatePosition(); // set initially
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  useEffect(() => {
    // Setup axios interceptor to handle session conflicts
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && error.response?.data?.sessionConflict) {
          // Session conflict detected
          toast.custom((t) => (
            <div
              className="bg-error text-white px-4 py-3 rounded shadow-md flex justify-between items-center"
              onClick={() => toast.dismiss(t)}
            >
              <div className='bg-error'>
                <p className="font-bold">Session Expired</p>
                <p className="text-white text-sm">
                  {error.response.data.message || "Your account has been logged in from another location."}
                </p>
              </div>
              <button
                className="ml-6 text-gray-200 rounded cursor-pointer"
                onClick={() => toast.dismiss(t)}
              >
                <X />
              </button>
            </div>
          ), { duration: 5000 });

          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);


  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<ViewUser />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/add-guide" element={<AddGuide />} />
              <Route path="/guides/edit-guide/:id" element={<EditGuide />} />
              <Route path="/feedbacks" element={<Feedbacks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
      <Toaster position={position} />
    </>
  )
}

export default App
