"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.createWorker = exports.getWorkerById = exports.getWorkers = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getWorkers = async (req, res) => {
    try {
        const workers = await prismaClient_1.default.worker.findMany({
            include: { crewWorkers: true }
        });
        res.json(workers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWorkers = getWorkers;
const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await prismaClient_1.default.worker.findUnique({
            where: { id },
            include: { crewWorkers: true }
        });
        if (!worker)
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        res.json(worker);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWorkerById = getWorkerById;
const createWorker = async (req, res) => {
    try {
        const { name, especialidad, certificaciones, experiencia, disponibilidad, estado } = req.body;
        if (!name || !especialidad) {
            return res.status(400).json({ error: 'Nombre y especialidad son requeridos' });
        }
        const worker = await prismaClient_1.default.worker.create({
            data: {
                name,
                especialidad,
                certificaciones: certificaciones || '',
                experiencia: experiencia ? parseInt(experiencia) : 0,
                disponibilidad: disponibilidad !== false,
                estado: estado || 'activo'
            }
        });
        res.json(worker);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createWorker = createWorker;
const updateWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, especialidad, certificaciones, experiencia, disponibilidad, estado } = req.body;
        const worker = await prismaClient_1.default.worker.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(especialidad && { especialidad }),
                ...(certificaciones && { certificaciones }),
                ...(experiencia !== undefined && { experiencia: parseInt(experiencia) }),
                ...(disponibilidad !== undefined && { disponibilidad }),
                ...(estado && { estado })
            }
        });
        res.json(worker);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateWorker = updateWorker;
const deleteWorker = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.default.worker.delete({ where: { id } });
        res.json({ ok: true, msg: 'Trabajador eliminado' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteWorker = deleteWorker;
