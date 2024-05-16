const express = require('express');
const router = express.Router();
const db = require('../config/bd');
// const { decrypt } = require("../functions/decrypt");
const key = process.env.Encrypt_Key;

router.post("/", async (req, res) => {
    try {
        const mail = req.user.email;
        const {
            clientID,
            accessToken,
            clientName,
            phoneNo,
            eMail,
        } = req.body;

        const encryptedAccessToken = await global.encrypt(accessToken, key);

        const userQuery = 'SELECT * FROM userdata WHERE Email = ?';
        db.execute(userQuery, [mail],async(error,data)=>{
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }
            const userdata = data;

            if (!userdata || userdata.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const dematAcc = userdata[0].DematAcc ? (userdata[0].DematAcc) : [];
            const clientExists = dematAcc.some(acc => acc.Dhan && acc.Dhan.clientID === clientID);
            
            if (clientExists) {
                return res.status(400).json({ error: "Client ID already linked to another account" });
            }

            const parentAccValue = dematAcc.length === 0 ? true : false;
            dematAcc.push({ 
                    clientID: clientID,
                    BrokerName:"Dhan",
                    clientName,
                    accessToken: encryptedAccessToken,
                    phoneNo,
                    eMail,
                    parentAcc: parentAccValue
            });

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';
            await db.execute(updateQuery, [updatedDematAcc, mail]);
        });
        return res.status(200).json({ message: "Dhan details saved successfully" });
    } catch (error) {
        console.error("Error saving Dhan details:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { dhanClientId } = req.body;

    try {
        const userQuery = 'SELECT DematAcc FROM userdata WHERE id = ?';
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

            const dhanAccIndex = dematAccArray.findIndex(acc => {
                const accObj = acc.Dhan || {};
                return accObj.clientID === dhanClientId;
            });

            if (dhanAccIndex === -1) {
                return res.status(404).json({ error: "Dhan account not found for this user" });
            }

            dematAccArray.splice(dhanAccIndex, 1);
            const updatedDematAcc = JSON.stringify(dematAccArray);

            const updateQuery = 'UPDATE userdata SET DematAcc = ? WHERE id = ?';
            db.query(updateQuery, [updatedDematAcc, id]);

            return res.status(200).json({ message: "Dhan account deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting Dhan account:", error);
        return res.status(500).json({ error: "Internal server error", error });
    }
});

module.exports = router;
