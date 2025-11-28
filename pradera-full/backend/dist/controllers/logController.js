"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLog = exports.updateLog = exports.createLog = exports.getLogById = exports.getLogs = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getLogs = async (req, res) => {
    try {
        const { crewId, projectId } = req.query;
        const logs = await prismaClient_1.default.log.findMany({
            where: {
                ...(crewId && { crewId: crewId }),
                ...(projectId && { projectId: projectId })
            },
            include: { crew: true, project: true }
        });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLogs = getLogs;
const getLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await prismaClient_1.default.log.findUnique({
            where: { id },
            include: { crew: true, project: true }
        });
        if (!log)
            return res.status(404).json({ error: 'Bitácora no encontrada' });
        res.json(log);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLogById = getLogById;
const createLog = async (req, res) => {
    try {
        const { crewId, projectId, fecha, actividades, incidentes, materiales, tiempos, observaciones, estado_herramientas } = req.body;
        if (!crewId || !projectId || !fecha) {
            return res.status(400).json({ error: 'crewId, projectId y fecha son requeridos' });
        }
        const log = await prismaClient_1.default.log.create({
            data: {
                crewId,
                projectId,
                fecha: new Date(fecha),
                descripcion: actividades || '',
                actividades: actividades || '',
                incidentes: incidentes || '',
                consumo_materiales: materiales || '',
                materiales_consumidos: materiales || '',
                tiempos_trabajo: tiempos || '',
                observaciones: observaciones || '',
                estado_herramientas: estado_herramientas || '',
                responsableId: 'system'
            },
            include: { crew: true, project: true }
        });
        res.json(log);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createLog = createLog;
const updateLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { actividades, incidentes, materiales, tiempos, observaciones, estado_herramientas } = req.body;
        const log = await prismaClient_1.default.log.update({
            where: { id },
            data: {
                ...(actividades && { actividades }),
                ...(incidentes && { incidentes }),
                ...(materiales && { materiales_consumido: materiales }),
                ...(tiempos && { tiempos_trabajo: tiempos }),
                ...(observaciones && { observaciones }),
                ...(estado_herramientas && { estado_herramientas })
            }
        });
        res.json(log);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateLog = updateLog;
const deleteLog = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.default.log.delete({ where: { id } });
        res.json({ ok: true, msg: 'Bitácora eliminada' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteLog = deleteLog;
