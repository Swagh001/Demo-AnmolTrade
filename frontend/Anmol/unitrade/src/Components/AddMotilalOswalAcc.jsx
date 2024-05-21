import React, { useState } from 'react';

export default function AddMotilalOswalAcc() {
  const [formData, setFormData] = useState({
    clientID: '',
    password: '',
    TOTPKey: '',
    APIKey: '',
    PAN: '',
    phoneNo: '',
    eMail: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch('https://unitrade-5vvy.onrender.com/MotilalOswal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add Motilal Oswal account');
      }

      const data = await response.json();
      setMessage('Motilal Oswal account added successfully!');
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Add Motilal Oswal Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client ID:</label>
          <input
            type="text"
            name="clientID"
            value={formData.clientID}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>TOTP Key:</label>
          <input
            type="text"
            name="TOTPKey"
            value={formData.TOTPKey}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>API Key:</label>
          <input
            type="text"
            name="APIKey"
            value={formData.APIKey}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>PAN:</label>
          <input
            type="text"
            name="PAN"
            value={formData.PAN}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone No:</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="eMail"
            value={formData.eMail}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Account</button>
      </form>
    </div>
  );
}
