import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class ModePaiementController {
  // Récupérer tous les modes de paiement
  static async getAllModesPaiement(_req, res, next) {
    try {
      const modes = await prisma.modePaiement.findMany();
      res.json({
        message: "Liste des modes de paiement récupérée avec succès.",
        data: modes,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des modes de paiement :", error);
      next({ status: 500, message: 'Erreur lors de la récupération des modes de paiement.' });
    }
  }

  // Récupérer un mode de paiement par ID
  static async getModePaiementById(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const mode = await prisma.modePaiement.findUnique({
        where: { id: Number(req.params.id) },
      });
      if (!mode) {
        return res.status(404).json({ message: 'Mode de paiement non trouvé avec cet ID.' });
      }
      res.json({
        message: "Mode de paiement récupéré avec succès.",
        data: mode,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du mode de paiement :", error);
      next({ status: 500, message: 'Erreur lors de la récupération du mode de paiement.' });
    }
  }

  // Ajouter un mode de paiement
  static async createModePaiement(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Vérifiez si le libellé existe déjà
      const existingMode = await prisma.modePaiement.findFirst({
        where: { libelle: req.body.libelle },
      });

      if (existingMode) {
        return res.status(400).json({
          message: "Ce libellé de mode de paiement existe déjà.",
        });
      }

      // Ajout du mode de paiement avec id_utilisateur (si nécessaire)
      const mode = await prisma.modePaiement.create({
        data: {
          libelle: req.body.libelle,
          id_utilisateur: req.user?.id, // Assurez-vous que le middleware authMiddleware injecte `req.user`
        },
      });

      res.status(201).json({
        message: "Mode de paiement ajouté avec succès.",
        data: mode,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Erreur de duplication de clé unique
        return res.status(400).json({
          message: "Un mode de paiement avec ce libellé existe déjà.",
        });
      }
      console.error("Erreur lors de l'ajout du mode de paiement :", error);
      next({ status: 500, message: "Erreur lors de l'ajout du mode de paiement." });
    }
  }

  // Mettre à jour un mode de paiement
  static async updateModePaiement(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Vérifiez d'abord si le mode de paiement existe
      const modeExists = await prisma.modePaiement.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!modeExists) {
        return res.status(404).json({ message: 'Mode de paiement non trouvé avec cet ID.' });
      }

      // Vérifiez si le nouveau libellé existe déjà
      if (req.body.libelle) {
        const existingMode = await prisma.modePaiement.findFirst({
          where: {
            libelle: req.body.libelle,
            NOT: { id: Number(req.params.id) }, // Exclure l'ID actuel
          },
        });

        if (existingMode) {
          return res.status(400).json({
            message: "Un mode de paiement avec ce libellé existe déjà.",
          });
        }
      }

      const mode = await prisma.modePaiement.update({
        where: { id: Number(req.params.id) },
        data: req.body,
      });

      res.json({
        message: "Mode de paiement mis à jour avec succès.",
        data: mode,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mode de paiement :", error);
      next({ status: 500, message: 'Erreur lors de la mise à jour du mode de paiement.' });
    }
  }

  // Supprimer un mode de paiement
  static async deleteModePaiement(req, res, next) {
    try {
      // Vérifiez d'abord si le mode de paiement existe
      const modeExists = await prisma.modePaiement.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!modeExists) {
        return res.status(404).json({ message: 'Mode de paiement non trouvé avec cet ID.' });
      }

      // Vérifiez si le mode de paiement est associé à un paiement
      const associatedPayments = await prisma.paiement.findFirst({
        where: { id_mode_paiement: Number(req.params.id) },
      });

      if (associatedPayments) {
        return res.status(400).json({
          message: 'Impossible de supprimer ce mode de paiement car il est associé à des paiements existants.',
        });
      }

      // Supprimez le mode de paiement s'il n'est pas associé
      await prisma.modePaiement.delete({
        where: { id: Number(req.params.id) },
      });

      res.json({
        message: "Mode de paiement supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du mode de paiement :", error);
      next({ status: 500, message: 'Erreur lors de la suppression du mode de paiement.' });
    }
  }
}
