const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const { encrypt } = require("../functions/encrypt");
const key = process.env.Encrypt_Key;

router.post("/", async (req, res) => {
    try {
        const mail = req.user.email;
        const {
            clientID,
            password,
            phoneNo,
            eMail,
        } = req.body;

        const encryptedPassword = await global.encrypt(password, key);

        const userQuery = 'SELECT * FROM UserData WHERE Email = ?';
        db.execute(userQuery, [mail],async(error,data)=>{
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }
            const userdata = data;

            if (!userdata || userdata.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            // let dematAcc = userdata[0].DematAcc ? (userdata[0].DematAcc) : [];
            // dematAcc = JSON.parse(dematAcc);
            // const clientExists = dematAcc.some(acc => acc.clientID === clientID);
            let dematAcc = userdata[0].DematAcc ? JSON.parse(userdata[0].DematAcc) : [];

dematAcc = Array.isArray(dematAcc) ? dematAcc : [];
const clientExists = dematAcc.some(acc => acc.clientID === clientID);
            
            if (clientExists) {
                return res.status(400).json({ error: "Client ID already linked to another account" });
            }

            const parentAccValue = dematAcc.length === 0 ? true : false;
            dematAcc.push({ 
                    clientID,
                    BrokerName:"FlatTrade",
                    password: encryptedPassword,
                    phoneNo,
                    eMail,
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);

            return res.status(200).json({ message: "FlatTrade details saved successfully" });

        });
    } catch (error) {
        console.error("Error saving FlatTrade details:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

router.delete("/delete", async (req, res) => {
    // const { id } = req.params;
    const id = req.user.email;
    const { flatTradeClientId } = req.body;

    try {
        const userQuery = 'SELECT DematAcc FROM UserData WHERE Email = ?';
        db.execute(userQuery, [id],async(err,result)=>{
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }

            const userdata = result[0];

            if (!userdata || userdata.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            let dematAcc = userdata.DematAcc || '[]';
            dematAcc = JSON.parse(dematAcc);
            const dematAccArray = (dematAcc);

            console.log(dematAccArray);

            const flatTradeAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.FlatTrade || {};
                return accObj.clientID === flatTradeClientId;
            });

            if (flatTradeAccIndex === -1) {
                return res.status(404).json({ error: "Flattrade account not found for this user" });
            }

            dematAccArray.splice(flatTradeAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            console.log(updatedDematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "FlatTrade account deleted successfully" });
            
        });
    } catch (error) {
        console.error("Error deleting FlatTrade account:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

module.exports = router;
