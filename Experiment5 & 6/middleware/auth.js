const jwt = require('jsonwebtoken');
const userModel = require('../models/user-Model');

const JWT_SECRET = 'your_jwt_secret_key'; // Use the same secret as in app.js

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded.user.id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = auth;
