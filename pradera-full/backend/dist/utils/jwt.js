"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.JWT_SECRET || 'changeme';
function signToken(payload, expiresIn = '8h') {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: expiresIn });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, SECRET);
}
