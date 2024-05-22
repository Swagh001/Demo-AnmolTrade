import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableData from './TableData';
import "../Styles/Table.css"

export const Table = () => {
    const [data, setData] = useState([]);
    const [Strike , setStrike ] = useState(0);
    const [timestamp , settimestamp ] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedExpiry, setSelectedExpiry] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    // Fetch data initially
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api', {
                    params: { symbol: 'NIFTY' },
                });
                setData(res.data);
                setLoading(false);
                // console.log(res.data.records.timestamp)
                settimestamp(res.data.records.timestamp);
                setStrike(res.data.records.underlyingValue);
                setFilteredData(res.data.filtered.data);
            }
            catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter data when selectedExpiry or tempSelectedExpiry changes
    useEffect(() => {
        if (selectedExpiry !== '') {
            // console.log(data)
            const filtered = data.records.data.filter((item) => item.expiryDate === selectedExpiry);
            setFilteredData(filtered);
            // console.log(filtered)
        }
    }, [selectedExpiry, data]);

    const handleExpiryChange = (e) => {
        setSelectedExpiry(e.target.value);
    };

    if (loading) {
        return <div>
            {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP2rhD96TNCHDrf7uU-ekQENxXt4XQjtuwzUSC-j7IMg&s" alt="loading" style={{width:"100%"}}/> */}
        </div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container-1'>

            Expiry Date
            <select name="selectdata" id="selectdata" onChange={handleExpiryChange}>
                {data.records.expiryDates.map((expiry, index) => (
                    <option key={index} value={expiry}>
                        {expiry}
                    </option>
                ))}
            </select>
            <h3>Underlying Index: NIFTY: {Strike} As on {timestamp}</h3>
            
            <table className='tableinfo'>
                <thead className='tableHead'>
                    <tr>
                        <th colSpan={11}>CALLS</th>
                        <th colSpan={12}>PUTS</th>
                    </tr>
                    <tr>
                        <th className='thborder'></th>
                        <th className='thborder'>OI</th>
                        <th className='thborder'>CHNG IN OI</th>
                        <th className='thborder'>VOLUME</th>
                        <th className='thborder'>IV</th>
                        <th className='thborder'>LTP</th>
                        <th className='thborder'>CHNG</th>
                        <th className='thborder'>BID QTY</th>
                        <th className='thborder'>BID</th>
                        <th className='thborder'>ASK</th>
                        <th className='thborder'>ASK QTY</th>

                        <th className='thborder'> STRIKE</th>
                        
                        <th className='thborder'>BID QTY</th>
                        <th className='thborder'>BID</th>
                        <th className='thborder'>ASK</th>
                        <th className='thborder'>ASK QTY</th>
                        <th className='thborder'>CHNG</th>
                        <th className='thborder'>LTP</th>
                        <th className='thborder'>IV</th>
                        <th className='thborder'>VOLUME</th>
                        <th className='thborder'>CHNG IN OI</th>
                        <th className='thborder'>OI</th>
                        <th className='thborder'></th>
                    </tr>
                </thead>
                <tbody className='tableBody'>
                    <TableData data={filteredData} 
                    Strike={Strike}
                    />
                </tbody>
            </table>
        </div>
    );
};
