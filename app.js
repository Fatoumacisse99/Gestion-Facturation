import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import factureRoutes from './src/routes/factureRoutes.js';
import paiementRoutes from './src/routes/PaiementRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import userRoutes from './src/routes/utilisateurRoutes.js';
import modePaiementRoutes from './src/routes/modePaiementRoutes.js';
import errorHandler from './src/middlewares/validationHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';

import dotenv from 'dotenv';
const app = express();
dotenv.config();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/factures', factureRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/modes', modePaiementRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
// Définir une route de test
app.get('/', (_req, res) => {
  res.send('Bonjour, bienvenue dans mon projet Express!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
