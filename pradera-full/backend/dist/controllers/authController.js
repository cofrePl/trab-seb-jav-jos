"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;
        const hashed = await (0, hash_1.hashPassword)(password);
        const user = await prismaClient_1.default.user.create({ data: { name, email, password: hashed, role } });
        res.json({ id: user.id, email: user.email });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await (0, hash_1.comparePassword)(password, user.password);
        if (!ok)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = (0, jwt_1.signToken)({ id: user.id, email: user.email, role: user.role });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
