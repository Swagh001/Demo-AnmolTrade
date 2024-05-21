import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import ShowAcc from '../Pages/ShowAcc';
import PrivateRoute from './PrivateRoute ';
import AddAccount from '../Pages/AddAccount';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/addAcc/:brokerName' element={<PrivateRoute element={AddAccount} />} />
      <Route path='/showAcc' element={<PrivateRoute element={ShowAcc} />} />
    </Routes>
  );
};

export {AllRoutes};
