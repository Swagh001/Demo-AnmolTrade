const express = require('express');
const router = express.Router();
const db = require('../config/bd');
const { encrypt } = require("../functions/encrypt");
const key = process.env.Encrypt_Key;



router.post("/", async (req, res) => {
    try {
        const mail = req.user.email;
        const {clientID} = req.body;

        const userQuery = 'SELECT * FROM UserData WHERE Email = ?';

        db.execute(userQuery, [mail], async (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }
            let userdata = data[0].DematAcc;
            userdata = JSON.parse(userdata);

            let dematAcc = userdata.map((ele,ind)=>{
                if(ele.clientID===clientID){
                    ele.parentAcc=true;
                }
                else{
                    ele.parentAcc=false;
                }
                return ele;
            })

            const updatedDematAcc = JSON.stringify(dematAcc);

            const updateQuery = 'UPDATE UserData SET DematAcc = ? WHERE Email = ?';

            db.execute(updateQuery, [updatedDematAcc, mail],()=>{
                return res.status(200).json({ message: "Parent Account Updated successfully" });
            });
        })
    } 
    catch (error) {
        return res.status(400).json({message:"Error"});
    }
});

module.exports = router;