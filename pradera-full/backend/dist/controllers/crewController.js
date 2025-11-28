"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWorkerFromCrew = exports.addWorkerToCrew = exports.deleteCrew = exports.updateCrew = exports.createCrew = exports.getCrewById = exports.getCrews = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getCrews = async (req, res) => {
    try {
        const crews = await prismaClient_1.default.crew.findMany({
            include: { project: true, crewWorkers: { include: { worker: true } }, logs: true }
        });
        res.json(crews);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCrews = getCrews;
const getCrewById = async (req, res) => {
    try {
        const { id } = req.params;
        const crew = await prismaClient_1.default.crew.findUnique({
            where: { id },
            include: { project: true, crewWorkers: { include: { worker: true } }, logs: true }
        });
        if (!crew)
            return res.status(404).json({ error: 'Cuadrilla no encontrada' });
        res.json(crew);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCrewById = getCrewById;
const createCrew = async (req, res) => {
    try {
        const { name, projectId, fecha_inicio, estado } = req.body;
        if (!name || !estado) {
            return res.status(400).json({ error: 'Nombre y estado son requeridos' });
        }
        const crew = await prismaClient_1.default.crew.create({
            data: {
                name,
                projectId: projectId || undefined,
                fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
                estado: estado || 'ACTIVA'
            }
        });
        res.json(crew);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createCrew = createCrew;
const updateCrew = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, projectId, fecha_inicio, estado } = req.body;
        const crew = await prismaClient_1.default.crew.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(projectId && { projectId }),
                ...(fecha_inicio && { fecha_inicio: new Date(fecha_inicio) }),
                ...(estado && { estado })
            }
        });
        res.json(crew);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCrew = updateCrew;
const deleteCrew = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.default.crew.delete({ where: { id } });
        res.json({ ok: true, msg: 'Cuadrilla eliminada' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteCrew = deleteCrew;
const addWorkerToCrew = async (req, res) => {
    try {
        const { crewId, workerId, role } = req.body;
        if (!crewId || !workerId || !role) {
            return res.status(400).json({ error: 'crewId, workerId y role son requeridos' });
        }
        const crewWorker = await prismaClient_1.default.crewWorker.create({
            data: { crewId, workerId, role }
        });
        res.json(crewWorker);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addWorkerToCrew = addWorkerToCrew;
const removeWorkerFromCrew = async (req, res) => {
    try {
        const { crewWorkerId } = req.params;
        await prismaClient_1.default.crewWorker.delete({ where: { id: crewWorkerId } });
        res.json({ ok: true, msg: 'Trabajador removido de la cuadrilla' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeWorkerFromCrew = removeWorkerFromCrew;
