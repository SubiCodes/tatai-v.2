import './App.css'

import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/util/ProtectedRoute.jsx';
import Layout from './components/util/Layout.jsx';
import Login from './components/Pages/Login.jsx'
import Dashboard from './components/Pages/Dashboard.jsx';
import Users from './components/Pages/Users.jsx';
import Settings from './components/Pages/Settings.jsx';

function App() {

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
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
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
