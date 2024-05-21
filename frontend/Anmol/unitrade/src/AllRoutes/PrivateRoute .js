// src/routes/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://unitrade-5vvy.onrender.com/verifytoken', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setIsChecking(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsChecking(false);
      });
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
