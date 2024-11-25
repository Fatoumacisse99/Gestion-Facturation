// src/routs/profileRoutes.js
import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();
router.get('/', authenticateToken, async (req, res) => {
    try {
      const { id, role } = req.user;
        const user = await prisma.utilisateur.findUnique({
        where: { id },
        select: { id: true, nom: true, email: true, role: true },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }
  
      res.status(200).json({
        message: 'Bienvenue sur votre profil.',
        user, 
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur interne.', error: error.message });
    }
  });
 
  router.put('/', authenticateToken, async (req, res) => {
    try {
      const { id } = req.user; // Récupération de l'utilisateur connecté via le token
      const { nom, email, mot_de_passe } = req.body; // Données à mettre à jour
  
      const updateData = {};
      if (nom) updateData.nom = nom;
      if (email) updateData.email = email;
      if (mot_de_passe) {
        updateData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
      }
  
      const updatedUser = await prisma.utilisateur.update({
        where: { id },
        data: updateData,
        select: { id: true, nom: true, email: true, role: true },
      });
  
      res.status(200).json({
        message: 'Profil mis à jour avec succès.',
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur interne.', error: error.message });
    }
    router.post('/change-password', authenticateToken, async (req, res) => {
      try {
        const { id } = req.user;
        const { oldPassword, newPassword } = req.body;
    
        const user = await prisma.utilisateur.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    
        const isMatch = await bcrypt.compare(oldPassword, user.mot_de_passe);
        if (!isMatch) return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.utilisateur.update({
          where: { id },
          data: { mot_de_passe: hashedPassword },
        });
    
        res.status(200).json({ message: 'Mot de passe changé avec succès.' });
      } catch (error) {
        res.status(500).json({ message: 'Erreur interne.', error: error.message });
      }
    });    
  });

  
  export default router;
