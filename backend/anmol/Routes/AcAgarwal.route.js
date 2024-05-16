// full working



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
            APIKey,
            APISecretKEY,
            phoneNo,
            eMail,
        } = req.body;
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
            const clientExists = dematAcc.some(acc => acc.clientID === clientID);
            
            if (clientExists) {
                return res.status(400).json({ error: "Client ID already linked to another account" });
            }

            const parentAccValue = dematAcc.length === 0 ? true : false;
            dematAcc.push({ 
                    BrokerName:"ACAgarwal",
                    clientID, 
                    APIKey: encryptedAPIKey, 
                    APISecretKEY: encryptedAPISecretKEY, 
                    phoneNo, 
                    eMail,
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);

            return res.status(200).json({ message: "ACAgarwal details saved successfully" });
        });
    } catch (error) {
        console.error("Error saving ACAgarwal details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { aCAgarwalClientId } = req.body;

    console.log(id,aCAgarwalClientId);

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

            const aCAgarwalAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.ACAgarwal || {};
                return accObj.clientID === aCAgarwalClientId;
            });

            console.log(aCAgarwalAccIndex);

            if (aCAgarwalAccIndex === -1) {
                return res.status(404).json({ error: "ACAgarwal account not found for this user" });
            }

            dematAccArray.splice(aCAgarwalAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            console.log(updatedDematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE id = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "ACAgarwal account deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting ACAgarwal account:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});





module.exports = router;
