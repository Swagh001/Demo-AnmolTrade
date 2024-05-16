const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passwordValidator = require('../middleware/PasswordValidator');
const connection = require('../config/bd'); // Import the MySQL connection

const salt = parseInt(process.env.Salt_Round);
const jwtSecret = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    try {
        const { name, email, phoneNo, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, salt);

        // Query to check if the email already exists
        const checkEmailQuery = `
            SELECT * FROM UserData WHERE Email = ?
        `;

        connection.query(checkEmailQuery, [email], (err, results) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).send({
                    message: "Something went wrong",
                    code: "500",
                });
            }

            if (results.length > 0) {
                // Email already exists
                return res.status(200).send({
                    message: "User Already Has an Account",
                    code: "200",
                });
            } else {
                // Email does not exist, proceed with user creation
                const insertUserQuery = `
                    INSERT INTO UserData (Name, Password, phoneNo, Email)
                    VALUES (?, ?, ?, ?)
                `;

                connection.query(insertUserQuery, [name, hashedPassword, phoneNo, email], (err, result) => {
                    if (err) {
                        console.error("Error creating user:", err);
                        return res.status(500).send({
                            message: "Something went wrong",
                            code: "500",
                        });
                    }

                    return res.status(200).send({
                        message: "User Account Created Successfully",
                        code: "200",
                    });
                });
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send({
            message: "Something went wrong",
            code: "500",
        });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Query to retrieve user by email
    const selectUserQuery = `
        SELECT * FROM UserData WHERE Email = ?
    `;

    // Execute select user query
    connection.query(selectUserQuery, [email], async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).send({
                message: "Something went wrong",
                code: "500",
            });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];
        const hashedPassword = user.Password;

        // Compare passwords
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (result) {
                // Generate JWT token
                const token = jwt.sign({ email: user.Email, userId: user.ID }, jwtSecret);
                return res.status(200).json({ message: "Login Success", token });
            } else {
                return res.status(401).json({ error: "Wrong Email or Password" });
            }
        });
    });
});

module.exports = router;
