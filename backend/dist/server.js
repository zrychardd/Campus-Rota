"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const perfilRoutes_1 = __importDefault(require("./routes/perfilRoutes"));
const trajetoRoutes_1 = __importDefault(require("./routes/trajetoRoutes"));
const reservaRoutes_1 = __importDefault(require("./routes/reservaRoutes"));
const viagemRoutes_1 = __importDefault(require("./routes/viagemRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/perfil', perfilRoutes_1.default);
app.use('/api/trajeto', trajetoRoutes_1.default);
app.use('/api/reserva', reservaRoutes_1.default);
app.use('/api/viagem', viagemRoutes_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'Campus Rota API' });
});
app.listen(PORT, () => {
    console.log(`✅ Campus Rota API rodando em http://localhost:${PORT}`);
});
