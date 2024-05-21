import React, { useState, useEffect } from 'react';

const ShowAcc = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://unitrade-5vvy.onrender.com/brokers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      // Sort accounts with parent account on top
      const sortedAccounts = sortAccounts(data);
      setAccounts(sortedAccounts);
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  const sortAccounts = (accounts) => {
    const parentAcc = accounts.find(acc => acc.isParent);
    const childAccs = accounts.filter(acc => !acc.isParent);
    return parentAcc ? [parentAcc, ...childAccs] : childAccs;
  };

  const handleDelete = async (broker, clientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://unitrade-5vvy.onrender.com/${broker}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [`${broker}ClientId`]: clientId })
      });
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      // Refresh accounts after deletion
      fetchAccounts();
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  const handleUpdateParent = async (clientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://unitrade-5vvy.onrender.com/updateParent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clientID: clientId })
      });
      if (!response.ok) {
        throw new Error('Failed to update parent account');
      }
      // Refresh accounts after updating parent
      fetchAccounts();
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Show Accounts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {accounts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Broker</th>
              <th>Client ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td>{account.broker}</td>
                <td>{account.ClientId}</td>
                <td>
                  {!account.isParent && (
                    <>
                      <button onClick={() => handleDelete(account.broker, account.ClientId)}>Delete</button>
                      <button onClick={() => handleUpdateParent(account.ClientId)}>Update Parent</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No accounts available.</p>
      )}
    </div>
  );
};

export default ShowAcc;
