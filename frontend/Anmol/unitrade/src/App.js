// src/App.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { AllRoutes } from './AllRoutes/Allroutes';

const App = () => {
  const location = useLocation();

  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <AllRoutes />    </div>
  );
};

export default App;
