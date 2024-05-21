// BrokerButtons.js
import React from 'react';
import { Link } from 'react-router-dom';

const BrokerButtons = () => {
  return (
    <div>
      <h3>Choose a Broker:</h3>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Link to="/addAcc/zerodha" style={{ marginRight: '10px' }}>
          <button>Zerodha</button>
        </Link>
        <Link to="/addAcc/finvasia" style={{ marginRight: '10px' }}>
          <button>Finvasia</button>
        </Link>
        <Link to="/addAcc/aliceblue" style={{ marginRight: '10px' }}>
          <button>Alice Blue</button>
        </Link>
        <Link to="/addAcc/flattrade" style={{ marginRight: '10px' }}>
          <button>FlatTrade</button>
        </Link>
        <Link to="/addAcc/acagarwal" style={{ marginRight: '10px' }}>
          <button>Z Ac Agarwal</button>
        </Link>
        <Link to="/addAcc/angelbroking" style={{ marginRight: '10px' }}>
          <button>Angel Broking</button>
        </Link>
        <Link to="/addAcc/dhan" style={{ marginRight: '10px' }}>
          <button>Dhan</button>
        </Link>
        <Link to="/addAcc/fyers" style={{ marginRight: '10px' }}>
          <button>Fyers</button>
        </Link>
        <Link to="/addAcc/motilaloswal" style={{ marginRight: '10px' }}>
          <button>Motilal Oswal</button>
        </Link>
      </div>
    </div>
  );
};

export default BrokerButtons;
