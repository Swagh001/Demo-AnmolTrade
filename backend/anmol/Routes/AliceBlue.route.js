const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const { encrypt } = require("../functions/encrypt");
const key = process.env.Encrypt_Key;

router.post("/", async (req, res) => {
    try {
        console.log("Hii")
        const mail = req.user.email;
        const {
            clientID,
            password,
            TOTPKey,
            phoneNo,
            eMail,
        } = req.body;

        const encryptedPassword = await global.encrypt(password, key);
        const encryptedTOTPKey = await global.encrypt(TOTPKey, key);

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
            const clientExists = dematAcc.some(acc => acc.AliceBlue && acc.AliceBlue.clientID === clientID);
            
            if (clientExists) {
                return res.status(400).json({ error: "Client ID already linked to another account" });
            }

            const parentAccValue = dematAcc.length === 0 ? true : false;
            dematAcc.push({ 
                    clientID,
                    BrokerName:"AliceBlue",
                    password: encryptedPassword, 
                    TOTPKey: encryptedTOTPKey, 
                    phoneNo, 
                    eMail, 
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);

            return res.status(200).json({ message: "AliceBlue details saved successfully" });
        });
    } catch (error) {
        console.error("Error saving AliceBlue details:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { aliceBlueClientId } = req.body;

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
            const dematAccArray = (dematAcc);

            // console.log(dematAccArray);

            const aliceBlueAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.AliceBlue || {};
                return accObj.clientID === aliceBlueClientId;
            });

            if (aliceBlueAccIndex === -1) {
                return res.status(404).json({ error: "AliceBlue account not found for this user" });
            }

            dematAccArray.splice(aliceBlueAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE id = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "AliceBlue account deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting AliceBlue account:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

module.exports = router;
