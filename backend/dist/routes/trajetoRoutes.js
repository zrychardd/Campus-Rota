"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const perfilController_1 = require("../controllers/perfilController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, perfilController_1.listarTrajetos);
router.post('/', authMiddleware_1.authMiddleware, perfilController_1.salvarTrajeto);
exports.default = router;
