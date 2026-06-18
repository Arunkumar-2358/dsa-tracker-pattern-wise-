"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roadmap_controller_1 = require("../controllers/roadmap.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', roadmap_controller_1.getRoadmaps);
router.get('/:id', roadmap_controller_1.getRoadmapById);
router.post('/', roadmap_controller_1.createRoadmap);
router.patch('/:id', roadmap_controller_1.updateRoadmap);
router.delete('/:id', roadmap_controller_1.deleteRoadmap);
router.post('/:id/nodes', roadmap_controller_1.addNode);
router.delete('/:id/nodes/:nodeId', roadmap_controller_1.deleteNode);
exports.default = router;
//# sourceMappingURL=roadmap.routes.js.map