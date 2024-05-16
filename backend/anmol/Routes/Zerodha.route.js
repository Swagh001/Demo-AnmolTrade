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
            APISecretKEY,
            phoneNo,
            eMail,
        } = req.body;

        const encryptedPassword = await global.encrypt(password, key);
        const encryptedTOTPKey = await global.encrypt(TOTPKey, key);
        const encryptedAPIKey = await global.encrypt(APIKey, key);
        const encryptedAPISecretKEY = await global.encrypt(APISecretKEY, key);

        const userQuery = 'SELECT * FROM UserData WHERE Email = ?';
        db.execute(userQuery, [mail], async (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }
            const userdata = data;

            if (!userdata || userdata.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const dematAcc = userdata[0].DematAcc ? (userdata[0].DematAcc) : [];
            const clientExists = dematAcc.some(acc => acc.Zerodha && acc.Zerodha.clientID === clientID);
            
            if (clientExists) {
                return res.status(400).json({ error: "Client ID already linked to another account" });
            }

            const parentAccValue = dematAcc.length === 0 ? true : false;
            dematAcc.push({ 
                    clientID, 
                    BrokerName:"Zerodha",
                    password: encryptedPassword,
                    TOTPKey: encryptedTOTPKey,
                    APIKey: encryptedAPIKey,
                    APISecretKEY: encryptedAPISecretKEY,
                    phoneNo: phoneNo,
                    eMail: eMail,
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);

            return res.status(200).json({ message: "Zerodha details saved successfully" });
        });
    } 
    catch (error) {
        console.error("Error saving Zerodha details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { zerodhaClientId } = req.body;

    try {
        const userQuery = 'SELECT DematAcc FROM UserData WHERE id = ?';
        db.query(userQuery, [id], async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }

            const userdata = result[0];

            if (!userdata || userdata.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            let dematAcc = userdata.DematAcc || '[]';
            const dematAccArray = (dematAcc);

            console.log(dematAccArray);

            const zerodhaAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.Zerodha || {};
                return accObj.clientID === zerodhaClientId;
            });

            console.log(zerodhaAccIndex);

            if (zerodhaAccIndex === -1) {
                return res.status(404).json({ error: "Zerodha account not found for this user" });
            }

            dematAccArray.splice(zerodhaAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            console.log(updatedDematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE id = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "Zerodha account deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting Zerodha account:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
