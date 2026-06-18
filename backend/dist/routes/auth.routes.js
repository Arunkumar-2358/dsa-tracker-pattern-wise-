"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/request-otp', auth_controller_1.requestOtp);
router.post('/verify-otp', auth_controller_1.verifyOtp);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMe);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map