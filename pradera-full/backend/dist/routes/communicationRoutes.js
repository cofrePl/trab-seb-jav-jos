"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communicationController_1 = require("../controllers/communicationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Mensajes
router.get('/messages', auth_1.ensureAuth, communicationController_1.getMessages);
router.post('/messages', auth_1.ensureAuth, communicationController_1.createMessage);
// Solicitudes
router.get('/requests', auth_1.ensureAuth, communicationController_1.getRequests);
router.post('/requests', auth_1.ensureAuth, communicationController_1.createRequest);
router.put('/requests/:id', auth_1.ensureAuth, communicationController_1.updateRequestStatus);
exports.default = router;
