// src/routs/profileRoutes.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
router.get('/', authenticateToken, async (req, res) => {
    try {
      const { id, role } = req.user; // Récupération des données depuis le token
  
      // Exemple : Charger les détails utilisateur depuis la base de données
      const user = await prisma.utilisateur.findUnique({
        where: { id },
        select: { id: true, nom: true, email: true, role: true },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }
  
      res.status(200).json({
        message: 'Bienvenue sur votre profil.',
        user, // Renvoie uniquement les informations essentielles
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur interne.', error: error.message });
    }
  });
  export default router;
