"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuth = ensureAuth;
const jwt_1 = require("../utils/jwt");
function ensureAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ message: 'No token' });
    const parts = auth.split(' ');
    if (parts.length !== 2)
        return res.status(401).json({ message: 'Invalid token' });
    const token = parts[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token invalid' });
    }
}
