// AddAccount.js
import React from 'react';
import { useParams } from 'react-router-dom';
import BrokerButtons from '../Components/BrokerButtons';
import AddZerodhaAcc from '../Components/AddZerodhaAcc';
import AddFinvasiaAcc from '../Components/AddFinvasiaAcc';
import AddAliceBlueAcc from '../Components/AddAliceBlueAcc';
import AddFlatTradeAcc from '../Components/AddFlatTradeAcc';
import AddZAcAgarwalAcc from '../Components/AddAcAgarwalAcc';
import AddAngelBrokingAcc from '../Components/AddAngelBrokingAcc';
import AddDhanAcc from '../Components/AddDhanAcc';
import AddFyersAcc from '../Components/AddFyersAcc';
import AddMotilalOswalAcc from '../Components/AddMotilalOswalAcc';

const AddAccount = () => {
  const { brokerName } = useParams();
  console.log(brokerName)

  const renderBrokerComponent = () => {
    switch (brokerName) {
      case 'zerodha':
        return <AddZerodhaAcc />;
      case 'finvasia':
        return <AddFinvasiaAcc />;
      case 'aliceblue':
        return <AddAliceBlueAcc />;
      case 'flattrade':
        return <AddFlatTradeAcc />;
      case 'acagarwal':
        return <AddZAcAgarwalAcc />;
      case 'angelbroking':
        return <AddAngelBrokingAcc />;
      case 'dhan':
        return <AddDhanAcc />;
      case 'fyers':
        return <AddFyersAcc />;
      case 'motilaloswal':
        return <AddMotilalOswalAcc />;
      default:
        return <p>Select a broker to add an account.</p>;
    }
  };

  return (
    <div>
      <BrokerButtons />
      {renderBrokerComponent()}
    </div>
  );
};

export default AddAccount;
