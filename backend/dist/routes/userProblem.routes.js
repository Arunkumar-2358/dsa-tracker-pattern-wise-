"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userProblem_controller_1 = require("../controllers/userProblem.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', userProblem_controller_1.getAllUserProblems);
router.get('/:problemId', userProblem_controller_1.getUserProblem);
router.patch('/:problemId/status', userProblem_controller_1.updateStatus);
router.post('/:problemId/click', userProblem_controller_1.trackClick);
exports.default = router;
//# sourceMappingURL=userProblem.routes.js.map