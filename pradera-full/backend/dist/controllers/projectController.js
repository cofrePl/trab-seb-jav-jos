"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getProjects = async (req, res) => {
    try {
        const projects = await prismaClient_1.default.project.findMany({
            include: { crews: true, logs: true }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prismaClient_1.default.project.findUnique({
            where: { id },
            include: { crews: true, logs: true }
        });
        if (!project)
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const { name, tipo_obra, complejidad, duracion_estimada, zona_trabajo, estado } = req.body;
        if (!name || !tipo_obra || !zona_trabajo) {
            return res.status(400).json({ error: 'Nombre, tipo de obra y zona de trabajo son requeridos' });
        }
        const project = await prismaClient_1.default.project.create({
            data: {
                name,
                tipo_obra,
                complejidad: complejidad || 'media',
                duracion_estimada: duracion_estimada ? parseInt(duracion_estimada) : undefined,
                zona_trabajo,
                estado: estado || 'activo'
            }
        });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tipo_obra, complejidad, duracion_estimada, zona_trabajo, estado } = req.body;
        const project = await prismaClient_1.default.project.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(tipo_obra && { tipo_obra }),
                ...(complejidad && { complejidad }),
                ...(duracion_estimada && { duracion_estimada: parseInt(duracion_estimada) }),
                ...(zona_trabajo && { zona_trabajo }),
                ...(estado && { estado })
            }
        });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.default.project.delete({ where: { id } });
        res.json({ ok: true, msg: 'Proyecto eliminado' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteProject = deleteProject;
