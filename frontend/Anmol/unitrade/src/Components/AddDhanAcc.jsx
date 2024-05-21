import React, { useState } from 'react';

export default function AddDhanAcc() {
  const [formData, setFormData] = useState({
    clientID: '',
    accessToken: '',
    clientName: '',
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

      const response = await fetch('https://unitrade-5vvy.onrender.com/dhan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add Dhan account');
      }

      const data = await response.json();
      setMessage('Dhan account added successfully!');
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Add Dhan Account</h1>
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
          <label>Access Token:</label>
          <input
            type="text"
            name="accessToken"
            value={formData.accessToken}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
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
