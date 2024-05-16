const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const { encrypt } = require("../functions/encrypt");
const key = process.env.Encrypt_Key;

router.get("/", async (req, res) => {
    try {
        const mail = req.user.email;

        const userQuery = 'SELECT * FROM UserData WHERE Email = ?';

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
    } catch (error) {
        console.error("Error fetching DematAcc:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
