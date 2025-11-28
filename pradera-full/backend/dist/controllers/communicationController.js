"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatus = exports.getRequests = exports.createRequest = exports.createMessage = exports.getMessages = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getMessages = async (req, res) => {
    try {
        const { conversationId, userId } = req.query;
        const messages = await prismaClient_1.default.message.findMany({
            where: {
                ...(conversationId && { conversationId: conversationId }),
                ...(userId && {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                })
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMessages = getMessages;
const createMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const user = req.user;
        if (!receiverId || !content) {
            return res.status(400).json({ error: 'receiverId y content son requeridos' });
        }
        const message = await prismaClient_1.default.message.create({
            data: {
                senderId: user.id,
                receiverId,
                content,
                conversationId: [user.id, receiverId].sort().join('_')
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } }
            }
        });
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createMessage = createMessage;
const createRequest = async (req, res) => {
    try {
        const { requestType, description, urgency, crewId } = req.body;
        const user = req.user;
        if (!requestType || !description || !crewId) {
            return res.status(400).json({ error: 'requestType, description y crewId son requeridos' });
        }
        const request = await prismaClient_1.default.communicationRequest.create({
            data: {
                senderId: user.id,
                requestType,
                description,
                urgency: urgency || 'NORMAL',
                crewId,
                estado: 'PENDIENTE'
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                crew: { select: { id: true, name: true } }
            }
        });
        res.status(201).json(request);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createRequest = createRequest;
const getRequests = async (req, res) => {
    try {
        const { estado, userId } = req.query;
        const requests = await prismaClient_1.default.communicationRequest.findMany({
            where: {
                ...(estado && { estado: estado }),
                ...(userId && { senderId: userId })
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                crew: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRequests = getRequests;
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, respuesta } = req.body;
        if (!estado) {
            return res.status(400).json({ error: 'estado es requerido' });
        }
        const request = await prismaClient_1.default.communicationRequest.update({
            where: { id },
            data: {
                estado,
                respuesta: respuesta || ''
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                crew: { select: { id: true, name: true } }
            }
        });
        res.json(request);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateRequestStatus = updateRequestStatus;
