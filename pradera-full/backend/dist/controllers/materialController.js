"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMaterialRequest = exports.updateMaterialRequest = exports.createMaterialRequest = exports.getMaterialRequests = exports.deleteMaterial = exports.updateMaterial = exports.createMaterial = exports.getMaterialById = exports.getMaterials = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const getMaterials = async (req, res) => {
    try {
        const materials = await prismaClient_1.default.material.findMany({
            include: { requests: true }
        });
        res.json(materials);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMaterials = getMaterials;
const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await prismaClient_1.default.material.findUnique({
            where: { id },
            include: { requests: true }
        });
        if (!material)
            return res.status(404).json({ error: 'Material no encontrado' });
        res.json(material);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMaterialById = getMaterialById;
const createMaterial = async (req, res) => {
    try {
        const { name, descripcion, stock, unidad, precio } = req.body;
        if (!name || stock === undefined || !unidad || precio === undefined) {
            return res.status(400).json({ error: 'Nombre, stock, unidad y precio son requeridos' });
        }
        const material = await prismaClient_1.default.material.create({
            data: {
                name,
                descripcion: descripcion || '',
                stock: parseInt(stock),
                unidad,
                precio: parseFloat(precio)
            }
        });
        res.json(material);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createMaterial = createMaterial;
const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, descripcion, stock, unidad, precio } = req.body;
        const material = await prismaClient_1.default.material.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(descripcion && { descripcion }),
                ...(stock !== undefined && { stock: parseInt(stock) }),
                ...(unidad && { unidad }),
                ...(precio !== undefined && { precio: parseFloat(precio) })
            }
        });
        res.json(material);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateMaterial = updateMaterial;
const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.default.material.delete({ where: { id } });
        res.json({ ok: true, msg: 'Material eliminado' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteMaterial = deleteMaterial;
const getMaterialRequests = async (req, res) => {
    try {
        const requests = await prismaClient_1.default.materialRequest.findMany({
            include: { material: true, project: true, crew: true }
        });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMaterialRequests = getMaterialRequests;
const createMaterialRequest = async (req, res) => {
    try {
        const { materialId, projectId, crewId, cantidad, estado } = req.body;
        if (!materialId || !projectId || !crewId || cantidad === undefined) {
            return res.status(400).json({ error: 'materialId, projectId, crewId y cantidad son requeridos' });
        }
        const request = await prismaClient_1.default.materialRequest.create({
            data: {
                materialId,
                projectId,
                crewId,
                cantidad: parseInt(cantidad),
                estado: estado || 'PENDIENTE'
            }
        });
        res.json(request);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createMaterialRequest = createMaterialRequest;
const updateMaterialRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, estado } = req.body;
        const request = await prismaClient_1.default.materialRequest.update({
            where: { id },
            data: {
                ...(cantidad !== undefined && { cantidad: parseInt(cantidad) }),
                ...(estado && { estado })
            }
        });
        res.json(request);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateMaterialRequest = updateMaterialRequest;
const deleteMaterialRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await prismaClient_1.default.materialRequest.delete({ where: { id } });
        res.json({ ok: true, msg: 'Solicitud eliminada' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteMaterialRequest = deleteMaterialRequest;
