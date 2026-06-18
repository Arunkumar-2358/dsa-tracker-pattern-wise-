"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sheet_controller_1 = require("../controllers/sheet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', sheet_controller_1.getSheets);
router.get('/:id', sheet_controller_1.getSheetById);
router.post('/', sheet_controller_1.createSheet);
router.patch('/:id', sheet_controller_1.updateSheet);
router.delete('/:id', sheet_controller_1.deleteSheet);
router.post('/:id/problems', sheet_controller_1.addProblemToSheet);
router.delete('/:id/problems/:problemId', sheet_controller_1.removeProblemFromSheet);
exports.default = router;
//# sourceMappingURL=sheet.routes.js.map