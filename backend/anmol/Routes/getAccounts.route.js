const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const { encrypt } = require("../functions/encrypt");
const key = process.env.Encrypt_Key;

router.get("/", async (req, res) => {
    try {
        const mail = req.user.email;

        const userQuery = 'SELECT * FROM userdata WHERE Email = ?';

        db.execute(userQuery, [mail], async (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }
            const userdata = data[0].DematAcc;

            let name = userdata.map((ele,ind)=>{
                // console.log(ele)
                return {broker:ele.BrokerName,email:ele.eMail,ClientId:ele.clientID,isParent:ele.parentAcc};
            })

            res.send(name);
        });
        // console.log(mail);
        // const user = await User.findOne({ where: { email: mail } });

        // if (!user) {
        //     return res.status(404).json({ error: "User not found" });
        // }

        // const originalDemantAcc = user.DemantAcc.map(async acc => {
        //     let updatedAcc = { ...acc };
        //     if (updatedAcc.Zerodha) {
        //         if (updatedAcc.Zerodha.password) {
        //             updatedAcc.Zerodha.password = await global.decrypt(updatedAcc.Zerodha.password, key);
        //         }
        //         if (updatedAcc.Zerodha.TOTPKey) {
        //             updatedAcc.Zerodha.TOTPKey = await global.decrypt(updatedAcc.Zerodha.TOTPKey, key);
        //         }
        //         if (updatedAcc.Zerodha.APIKey) {
        //             updatedAcc.Zerodha.APIKey = await global.decrypt(updatedAcc.Zerodha.APIKey, key);
        //         }
        //         if (updatedAcc.Zerodha.APISecretKEY) {
        //             updatedAcc.Zerodha.APISecretKEY = await global.decrypt(updatedAcc.Zerodha.APISecretKEY, key);
        //         }
        //     }
        //     if (updatedAcc.AngleBroking) {
        //         if (updatedAcc.AngleBroking.password) {
        //             updatedAcc.AngleBroking.password = await global.decrypt(updatedAcc.AngleBroking.password, key);
        //         }
        //         if (updatedAcc.AngleBroking.TOTPKey) {
        //             updatedAcc.AngleBroking.TOTPKey = await global.decrypt(updatedAcc.AngleBroking.TOTPKey, key);
        //         }
        //         if (updatedAcc.AngleBroking.APIKey) {
        //             updatedAcc.AngleBroking.APIKey = await global.decrypt(updatedAcc.AngleBroking.APIKey, key);
        //         }
        //         if (updatedAcc.AngleBroking.APISecretKEY) {
        //             updatedAcc.AngleBroking.APISecretKEY = await global.decrypt(updatedAcc.AngleBroking.APISecretKEY, key);
        //         }
        //     }
        //     if (updatedAcc.AliceBlue) {
        //         if (updatedAcc.AliceBlue.password) {
        //             updatedAcc.AliceBlue.password = await global.decrypt(updatedAcc.AliceBlue.password, key);
        //         }
        //         if (updatedAcc.AliceBlue.TOTPKey) {
        //             updatedAcc.AliceBlue.TOTPKey = await global.decrypt(updatedAcc.AliceBlue.TOTPKey, key);
        //         }
        //     }
        //     if (updatedAcc.Fyers) {
        //         if (updatedAcc.Fyers.Mpin) {
        //             updatedAcc.Fyers.Mpin = await global.decrypt(updatedAcc.Fyers.Mpin, key);
        //         }
        //         if (updatedAcc.Fyers.TOTPKey) {
        //             updatedAcc.Fyers.TOTPKey = await global.decrypt(updatedAcc.Fyers.TOTPKey, key);
        //         }
        //     }
        //     if (updatedAcc.Finvasia) {
        //         if (updatedAcc.Finvasia.password) {
        //             updatedAcc.Finvasia.password = await global.decrypt(updatedAcc.Finvasia.password, key);
        //         }
        //         if (updatedAcc.Finvasia.TOTPKey) {
        //             updatedAcc.Finvasia.TOTPKey = await global.decrypt(updatedAcc.Finvasia.TOTPKey, key);
        //         }
        //         if (updatedAcc.Finvasia.IMEI) {
        //             updatedAcc.Finvasia.IMEI = await global.decrypt(updatedAcc.Finvasia.IMEI, key);
        //         }
        //         if (updatedAcc.Finvasia.APIKey) {
        //             updatedAcc.Finvasia.APIKey = await global.decrypt(updatedAcc.Finvasia.APIKey, key);
        //         }
        //         if (updatedAcc.Finvasia.VendorCode) {
        //             updatedAcc.Finvasia.VendorCode = await global.decrypt(updatedAcc.Finvasia.VendorCode, key);
        //         }
        //     }
        //     if (updatedAcc.Dhan) {
        //         if (updatedAcc.Dhan.accessToken) {
        //             updatedAcc.Dhan.accessToken = await global.decrypt(updatedAcc.Dhan.accessToken, key);
        //         }
        //     }
        //     if (updatedAcc.FlatTrade) {
        //         if (updatedAcc.FlatTrade.password) {
        //             updatedAcc.FlatTrade.password = await global.decrypt(updatedAcc.FlatTrade.password, key);
        //         }
        //         if (updatedAcc.FlatTrade.TOTPKey) {
        //             updatedAcc.FlatTrade.TOTPKey = await global.decrypt(updatedAcc.FlatTrade.TOTPKey, key);
        //         }
        //         if (updatedAcc.FlatTrade.APIKey) {
        //             updatedAcc.FlatTrade.APIKey = await global.decrypt(updatedAcc.FlatTrade.APIKey, key);
        //         }
        //         if (updatedAcc.FlatTrade.APISecretKEY) {
        //             updatedAcc.FlatTrade.APISecretKEY = await global.decrypt(updatedAcc.FlatTrade.APISecretKEY, key);
        //         }
        //     }
        //     if (updatedAcc.ACAgarwal) {
        //         if (updatedAcc.ACAgarwal.APIKey) {
        //             updatedAcc.ACAgarwal.APIKey = await global.decrypt(updatedAcc.ACAgarwal.APIKey, key);
        //         }
        //         if (updatedAcc.ACAgarwal.APISecretKEY) {
        //             updatedAcc.ACAgarwal.APISecretKEY = await global.decrypt(updatedAcc.ACAgarwal.APISecretKEY, key);
        //         }
        //     }
        //     if (updatedAcc.MotilalOswal) {
        //         if (updatedAcc.MotilalOswal.password) {
        //             updatedAcc.MotilalOswal.password = await global.decrypt(updatedAcc.MotilalOswal.password, key);
        //         }
        //         if (updatedAcc.MotilalOswal.TOTPKey) {
        //             updatedAcc.MotilalOswal.TOTPKey = await global.decrypt(updatedAcc.MotilalOswal.TOTPKey, key);
        //         }
        //         if (updatedAcc.MotilalOswal.APIKey) {
        //             updatedAcc.MotilalOswal.APIKey = await global.decrypt(updatedAcc.MotilalOswal.APIKey, key);
        //         }
        //         if (updatedAcc.MotilalOswal.PAN) {
        //             updatedAcc.MotilalOswal.PAN = await global.decrypt(updatedAcc.MotilalOswal.PAN, key);
        //         }
        //     }

        //     return updatedAcc;
        // });

        // const decryptedDemantAcc = await Promise.all(originalDemantAcc);

        // return res.status(200).json({ DemantAcc: decryptedDemantAcc });
    } catch (error) {
        console.error("Error fetching DematAcc:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
