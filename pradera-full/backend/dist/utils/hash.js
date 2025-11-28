"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (pw) => bcrypt_1.default.hash(pw, 10);
exports.hashPassword = hashPassword;
const comparePassword = (pw, hash) => bcrypt_1.default.compare(pw, hash);
exports.comparePassword = comparePassword;
