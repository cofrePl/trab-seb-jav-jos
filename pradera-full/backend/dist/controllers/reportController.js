"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryMetrics = exports.getWorkerMetrics = exports.getAllProjectsReport = exports.getProjectReport = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getProjectReport = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await prismaClient_1.default.project.findUnique({
            where: { id: projectId },
            include: {
                crews: { include: { crewWorkers: true } },
                logs: true,
                materialRequests: true
            }
        });
        if (!project)
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        // Calcular métricas
        const totalCrews = project.crews.length;
        const totalWorkers = project.crews.reduce((sum, crew) => sum + crew.crewWorkers.length, 0);
        const totalLogs = project.logs.length;
        const pendingRequests = project.materialRequests.filter(r => r.estado === 'PENDIENTE').length;
        // Simular porcentaje de avance (basado en logs)
        const advancePercentage = Math.min(100, totalLogs * 10);
        const report = {
            projectId,
            projectName: project.name,
            projectType: project.tipo_obra,
            location: project.zona_trabajo,
            status: project.estado,
            metrics: {
                totalCrews,
                totalWorkers,
                totalLogs,
                pendingRequests,
                advancePercentage
            },
            crews: project.crews.map(c => ({
                id: c.id,
                name: c.name,
                state: c.estado,
                workers: c.crewWorkers.length
            })),
            recentLogs: project.logs.slice(-5).reverse()
        };
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProjectReport = getProjectReport;
const getAllProjectsReport = async (req, res) => {
    try {
        const projects = await prismaClient_1.default.project.findMany({
            include: { crews: { include: { crewWorkers: true } }, logs: true, materialRequests: true }
        });
        const reports = projects.map(p => ({
            id: p.id,
            name: p.name,
            tipo_obra: p.tipo_obra,
            estado: p.estado,
            crews: p.crews.length,
            workers: p.crews.reduce((sum, c) => sum + c.crewWorkers.length, 0),
            logs: p.logs.length,
            advancePercentage: Math.min(100, p.logs.length * 10)
        }));
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllProjectsReport = getAllProjectsReport;
const getWorkerMetrics = async (req, res) => {
    try {
        const { workerId } = req.params;
        const worker = await prismaClient_1.default.worker.findUnique({
            where: { id: workerId },
            include: { crewWorkers: { include: { crew: { include: { project: true } } } } }
        });
        if (!worker)
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        const metrics = {
            workerId,
            workerName: worker.name,
            especialidad: worker.especialidad,
            experiencia: worker.experiencia,
            disponibilidad: worker.disponibilidad,
            projectsAssigned: worker.crewWorkers.length,
            projects: worker.crewWorkers.map(cw => ({
                projectName: cw.crew.project?.name,
                crewName: cw.crew.name,
                role: cw.role,
                assignedAt: cw.fecha_asignacion
            }))
        };
        res.json(metrics);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWorkerMetrics = getWorkerMetrics;
const getInventoryMetrics = async (req, res) => {
    try {
        const materials = await prismaClient_1.default.material.findMany({
            include: { requests: true }
        });
        const metrics = materials.map(m => ({
            id: m.id,
            name: m.name,
            stock: m.stock,
            unidad: m.unidad,
            precio: m.precio,
            estado: m.stock <= 5 ? 'CRITICO' : m.stock <= 20 ? 'BAJO' : 'NORMAL',
            requestsPending: m.requests.filter(r => r.estado === 'PENDIENTE').length
        }));
        const summary = {
            totalMaterials: materials.length,
            criticalStock: metrics.filter(m => m.estado === 'CRITICO').length,
            lowStock: metrics.filter(m => m.estado === 'BAJO').length,
            normalStock: metrics.filter(m => m.estado === 'NORMAL').length,
            totalValue: materials.reduce((sum, m) => sum + m.stock * m.precio, 0)
        };
        res.json({ summary, materials: metrics });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getInventoryMetrics = getInventoryMetrics;
