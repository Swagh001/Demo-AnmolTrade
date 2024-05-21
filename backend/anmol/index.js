const express = require("express");
const bcrypt = require('bcryptjs');
require('dotenv').config();
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

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

app.get('/', (req, res) => {
    res.send('server is working');
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
app.use(jwtMiddleware);
app.get("/verifytoken",(req,res)=>{
    res.status(200).send("User Verfied");
})
app.use("/zerodha", zerodhaRoute);
app.use("/angelbroking", angelbrokingRoute);
app.use("/aliceblue", aliceblueRoute);
app.use("/fyers", fyersRoute);
app.use("/finvasia", finvasiaRoute);
app.use("/dhan", dhanRoute);
app.use("/flattrade", flatTradeRoute);
app.use("/acagarwal", aCAgarwalRoute);
app.use("/motilaloswal", motilalOswalRoute);
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
