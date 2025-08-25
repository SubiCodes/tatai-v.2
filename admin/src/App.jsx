import './App.css'

import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner"
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
import AddData from './components/Pages/AddData.jsx';
import Feedbacks from './components/Pages/Feedbacks.jsx';
import Reports from './components/Pages/Reports.jsx';

import axios from 'axios';

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
              <Route path="/chatbot" element={<AddData />} />
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
