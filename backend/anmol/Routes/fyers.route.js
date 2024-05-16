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
            Mpin,
            TOTPKey,
            phoneNo,
            eMail,
        } = req.body;

        const encryptedMpin = await global.encrypt(Mpin, key);
        const encryptedTOTPKey = await global.encrypt(TOTPKey, key);

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

            let dematAcc = userdata[0].DematAcc ? (userdata[0].DematAcc) : [];
            dematAcc = JSON.parse(dematAcc);
            const clientExists = dematAcc.some(acc => acc.clientID === clientID);
            
            if (clientExists) {
                return res.status(400).json({ error: "Client ID already linked to another account" });
            }

            const parentAccValue = dematAcc.length === 0 ? true : false;
            dematAcc.push({ 
                    clientID,
                    BrokerName:"Fyers",
                    Mpin: encryptedMpin,
                    TOTPKey: encryptedTOTPKey,
                    phoneNo,
                    eMail,
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);

            return res.status(200).json({ message: "Fyers details saved successfully" });
        });
    } catch (error) {
        console.error("Error saving Fyers details:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { fyersClientId } = req.body;

    try {
        const userQuery = 'SELECT DematAcc FROM UserData WHERE id = ?';
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

            const fyersAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.Fyers || {};
                return accObj.clientID === fyersClientId;
            });

            if (fyersAccIndex === -1) {
                return res.status(404).json({ error: "Fyers account not found for this user" });
            }

            dematAccArray.splice(fyersAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            console.log(updatedDematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE id = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "Fyers account deleted successfully" });
            
        });
    } catch (error) {
        console.error("Error deleting Fyers account:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

module.exports = router;
