import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PrivateRoute = () => {
  const { authToken } = useContext(AuthContext);
  return authToken ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;