import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      // setisLoading(true);
      try {
        
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setisLoading(false);
          return;
        }

        const response = await fetch('https://unitrade-5vvy.onrender.com/verifytoken', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          setisLoading(false);
          setIsLoggedIn(true);
        }
        else{
          setisLoading(false);
        }
        
      } 
      catch (error) {
        setisLoading(false);
        console.error('Error verifying token:', error);
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const handleLogout = () => {
    // Clear token from localStorage and sessionStorage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    // Redirect to login page
    // navigate('/login');
  };
  if(isLoading){
    return <h1>Loading....</h1>
  }

  return (
    <nav>
      <ul>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/addAcc/zerodha">Add Accounts</Link>
            </li>
            <li>
              <Link to="/showAcc">Show Accounts</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
