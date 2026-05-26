"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const perfilController_1 = require("../controllers/perfilController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/me', authMiddleware_1.authMiddleware, perfilController_1.getMeuPerfil);
router.put('/me', authMiddleware_1.authMiddleware, perfilController_1.atualizarPerfil);
exports.default = router;
