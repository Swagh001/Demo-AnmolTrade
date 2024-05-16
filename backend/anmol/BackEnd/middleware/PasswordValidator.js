const passwordValidator = (req, res, next) => {
    const { password } = req.body;

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    if (!hasUpperCase) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter." });
    }

    if (!hasLowerCase) {
        return res.status(400).json({ error: "Password must contain at least one lowercase letter." });
    }

    if (!hasSpecialChar) {
        return res.status(400).json({ error: "Password must contain at least one special character." });
    }

    next();
};

module.exports = passwordValidator;
