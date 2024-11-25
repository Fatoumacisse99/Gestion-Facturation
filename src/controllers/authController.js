
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../services/emailService.js'; 

const prisma = new PrismaClient();

// Méthode pour la connexion
export const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Méthode pour demander un lien de réinitialisation de mot de passe
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `http://localhost:4000/auth/reset-password?token=${resetToken}`;
    console.log(`Lien de réinitialisation : ${resetLink}`);

    const emailContent = `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Bonjour ${user.nom},</p>
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien est valable pendant 15 minutes.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
    `;

    await sendEmail(email, 'Réinitialisation de mot de passe', emailContent);
    res.status(200).json({ message: 'Un lien de réinitialisation a été envoyé.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Méthode pour afficher la page de réinitialisation de mot de passe
export const resetPasswordPage = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token de réinitialisation manquant.' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect(`http://localhost:5173/reset-password?token=${token}`);
  } catch (error) {
    return res.status(400).json({ message: 'Lien de réinitialisation invalide.' });
  }
};

// Méthode pour réinitialiser le mot de passe
export const resetPassword = async (req, res) => {
  const { token, nouveau_mot_de_passe } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);

    await prisma.utilisateur.update({
      where: { id: decoded.id },
      data: { mot_de_passe: hashedPassword },
    });

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'Le lien de réinitialisation a expiré.'
      : 'Lien de réinitialisation invalide.';
    res.status(400).json({ message });
  }
};
