const express = require("express");
const bcrypt = require('bcryptjs');
require('dotenv').config();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());
const cache = {};
const CACHE_TTL = 60 * 1000; //

const { User } = require("./model/User");
const jwtMiddleware = require("./middleware/jwtMiddleware");
const zerodhaRoute = require("./Routes/Zerodha.route");
const angelbrokingRoute = require("./Routes/AngelBroking.route");
const aliceblueRoute = require("./Routes/AliceBlue.route");
const fyersRoute = require("./Routes/fyers.route");
const finvasiaRoute = require("./Routes/Finvasia.route");
const dhanRoute = require("./Routes/Dhan.route");
const flatTradeRoute = require("./Routes/FlatTrade.route");
const aCAgarwalRoute = require("./Routes/AcAgarwal.route");
const motilalOswalRoute = require("./Routes/MotilalOswal.route");
const brokerRoutes = require("./Routes/getAccounts.route");
const userRoutes = require('./Routes/User.route');
const connection = require("./config/bd");
const UpdateParentRoute = require("./Routes/UpdateParent.route");

const port = process.env.PORT;
const API_URL = 'https://www.nseindia.com/api/option-chain-indices';

app.get('/', (req, res) => {
    res.send('server is working');
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api', async (req, res) => {
    console.log("Received request at /api endpoint");

    try {
        const response = await axios.get(API_URL, {
            params: { symbol: req.query.symbol },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Referer": "https://www1.nseindia.com/products/content/equities/equities/archieve_eq.htm"
            },
            timeout: 10000 // Increased timeout to 10 seconds
        });
        console.log("Response data received:", response.data);
        res.set('Access-Control-Allow-Origin', '*');
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.error("Access Denied: Consider using official NSE APIs or reputable data providers.");
            res.status(403).send("Access Denied: NSE might be blocking scraping.");
        } else if (error.code === 'ECONNABORTED') {
            console.error("Error: Request timeout. Increase timeout or use a more reliable connection.");
            res.status(504).send("Request timeout");
        } else {
            console.error("Error fetching data:", error.message);
            res.status(500).send(error.toString());
        }
    }
});

app.use("/", userRoutes);
app.get('/storetoken', (req, res) => {
    const token = req.headers['authorization'];
    if (token) {
        res.send('Token Stored');
    } else {
        res.status(400).send('No token provided');
    }
});

app.post('/store-token', (req, res) => {
    const { token } = req.body;
    req.headers.authorization = `Bearer ${token}`;
    res.json({ message: 'Token stored successfully in request headers' });
  });

app.use(jwtMiddleware);
app.get("/verifytoken",(req,res)=>{
    res.status(200).send("User Verfied");
})
app.use("/zerodha", zerodhaRoute);
app.use("/AngleBroking", angelbrokingRoute);
app.use("/aliceBlue", aliceblueRoute);
app.use("/fyers", fyersRoute);
app.use("/finvasia", finvasiaRoute);
app.use("/dhan", dhanRoute);
app.use("/flatTrade", flatTradeRoute);
app.use("/acAgarwal", aCAgarwalRoute);
app.use("/MotilalOswal", motilalOswalRoute);
app.use("/brokers", brokerRoutes);
app.use("/updateParent",UpdateParentRoute);


app.listen(port, () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
        } else {
            console.log('Connected to database');
            createTable();
        }
    });
    console.log('Server running on port ' + port);
});

function createTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS UserData (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        phoneNo VARCHAR(20) NOT NULL,
        Email VARCHAR(255) NOT NULL UNIQUE,
        DematAcc TEXT NOT NULL
    )    
    `;
    
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created successfully',result);
        }
    });
}
