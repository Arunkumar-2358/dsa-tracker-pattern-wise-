"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const problem_controller_1 = require("../controllers/problem.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, problem_controller_1.getProblems);
router.get('/topics', auth_middleware_1.authenticate, problem_controller_1.getTopics);
router.get('/companies', auth_middleware_1.authenticate, problem_controller_1.getCompanies);
router.get('/:id', auth_middleware_1.authenticate, problem_controller_1.getProblemById);
router.post('/', auth_middleware_1.authenticate, problem_controller_1.createProblem);
router.patch('/:id', auth_middleware_1.authenticate, problem_controller_1.updateProblem);
router.delete('/:id', auth_middleware_1.authenticate, problem_controller_1.deleteProblem);
exports.default = router;
//# sourceMappingURL=problem.routes.js.map