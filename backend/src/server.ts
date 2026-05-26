import express      from 'express';
import cors         from 'cors';
import dotenv       from 'dotenv';
import authRoutes    from './routes/authRoutes';
import perfilRoutes  from './routes/perfilRoutes';
import trajetoRoutes from './routes/trajetoRoutes';
import reservaRoutes from './routes/reservaRoutes';
import viagemRoutes  from './routes/viagemRoutes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/perfil',  perfilRoutes);
app.use('/api/trajeto', trajetoRoutes);
app.use('/api/reserva', reservaRoutes);
app.use('/api/viagem',  viagemRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Campus Rota API' });
});

app.listen(PORT, () => {
  console.log(`✅ Campus Rota API rodando em http://localhost:${PORT}`);
});