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
            TOTPKey,
            APIKey,
            PAN,
            phoneNo,
            eMail,
        } = req.body;

        const encryptedPassword = await global.encrypt(password, key);
        const encryptedTOTPKey = await global.encrypt(TOTPKey, key);
        const encryptedAPIKey = await global.encrypt(APIKey, key);
        const encryptedPAN = await global.encrypt(PAN, key);

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
                    BrokerName:"MotilalOswal",
                    password: encryptedPassword,
                    TOTPKey: encryptedTOTPKey,
                    APIKey: encryptedAPIKey,
                    PAN: encryptedPAN,
                    phoneNo,
                    eMail,
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);

            return res.status(200).json({ message: "Motilal Oswal details saved successfully" });
        });
    } catch (error) {
        console.error("Error saving MotilalOswal details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.delete("/:id", async (req, res) => {
    // const { id } = req.params;
    const id = req.user.email;
    const { MotilalOswalClientId } = req.body;

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
//             let dematAcc = userdata[0].DematAcc ? JSON.parse(userdata[0].DematAcc) : [];

// dematAcc = Array.isArray(dematAcc) ? dematAcc : [];
// const clientExists = dematAcc.some(acc => acc.clientID === clientID);

            console.log(dematAccArray);

            const motilalOswalAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.MotilalOswal || {};
                return accObj.clientID === MotilalOswalClientId;
            });

            if (motilalOswalAccIndex === -1) {
                return res.status(404).json({ error: "Motilal Oswal account not found for this user" });
            }

            dematAccArray.splice(motilalOswalAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            console.log(updatedDematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "Motilal Oswal account deleted successfully" });
            
        });
    } catch (error) {
        console.error("Error deleting Motilal Oswal account:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

module.exports = router;
