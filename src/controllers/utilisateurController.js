import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default class UserController {
  // Récupérer tous les utilisateurs
  static async getAllUsers(_req, res, next) {
    try {
      const users = await prisma.utilisateur.findMany({
        select: { id: true, nom: true, email: true, role: true, statut: true },
      });
      res.json({
        message: "Liste des utilisateurs récupérée avec succès.",
        data: users,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la récupération des utilisateurs." });
    }
  }
  static async getUserById(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await prisma.utilisateur.findUnique({
        where: { id: Number(req.params.id) },
        select: { id: true, nom: true, email: true, role: true, statut: true },
      });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID." });
      }
      res.json({
        message: "Utilisateur récupéré avec succès.",
        data: user,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la récupération de l'utilisateur." });
    }
  }

  // Créer un utilisateur
  static async createUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nom, email, role, mot_de_passe } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.utilisateur.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Un utilisateur avec cet email existe déjà.",
        });
      }

      // Hashage du mot de passe avant de l'enregistrer
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      // Créer un utilisateur avec un statut par défaut (actif)
      const user = await prisma.utilisateur.create({
        data: { nom, email, role: role || 'COMPTABLE', mot_de_passe: hashedPassword },
      });
      
      console.log("User Created:", user);
      res.status(201).json({
        message: "Utilisateur ajouté avec succès.",
        data: user,
      });
    } catch (error) {
      console.error("Error in createUser:", error);
      next({ status: 500, message: "Erreur lors de l'ajout de l'utilisateur." });
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nom, email, role, mot_de_passe, statut } = req.body;
      const userId = Number(req.params.id);

      const existingUser = await prisma.utilisateur.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID." });
      }

      const duplicateUser = await prisma.utilisateur.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });
      if (duplicateUser) {
        return res.status(400).json({
          message: "Un autre utilisateur avec cet email existe déjà.",
        });
      }

      // Construire l'objet `data` avec les champs fournis uniquement
      const data = {};
      if (nom) data.nom = nom;
      if (email) data.email = email;
      if (role) data.role = role;
      if (mot_de_passe) data.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
      if (statut !== undefined) data.statut = statut;

      const user = await prisma.utilisateur.update({
        where: { id: userId },
        data: data,
      });

      res.json({
        message: "Utilisateur mis à jour avec succès.",
        data: user,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la mise à jour de l'utilisateur." });
    }
  }

  // Modifier le statut d’un utilisateur
  static async updateUserStatus(req, res, next) {
    const { statut } = req.body;

    if (!["actif", "inactif"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    try {
      const userId = Number(req.params.id);
      const existingUser = await prisma.utilisateur.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      if (existingUser.statut === statut) {
        return res.status(400).json({ message: `L'utilisateur est déjà ${statut}.` });
      }

      const updatedUser = await prisma.utilisateur.update({
        where: { id: userId },
        data: { statut },
      });

      res.json({
        message: `Statut de l'utilisateur mis à jour en ${statut}.`,
        data: updatedUser,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la mise à jour du statut." });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req, res, next) {
    try {
      const userId = Number(req.params.id);

      const existingUser = await prisma.utilisateur.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID." });
      }

      const hasRelations = [
        await prisma.facture.findFirst({ where: { id_utilisateur: userId } }),
        await prisma.paiement.findFirst({ where: { id_utilisateur: userId } }),
        await prisma.modePaiement.findFirst({ where: { id_utilisateur: userId } }),
        await prisma.client.findFirst({ where: { id_utilisateur: userId } }),
      ].filter(Boolean);

      if (hasRelations.length > 0) {
        return res.status(400).json({
          message: "Impossible de supprimer l'utilisateur car il est lié à des entités.",
        });
      }

      await prisma.utilisateur.delete({
        where: { id: userId },
      });

      res.json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la suppression de l'utilisateur." });
    }
  }
}
