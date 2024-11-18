import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class ClientController {
  static async getAllClients(_req, res, next) {
    try {
      const clients = await prisma.client.findMany();
      res.json({
        message: "Liste des clients récupérée avec succès.",
        data: clients,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la récupération des clients." });
    }
  }

  static async getClientById(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const client = await prisma.client.findUnique({
        where: { id: Number(req.params.id) },
      });
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé avec cet ID." });
      }
      res.json({
        message: "Client récupéré avec succès.",
        data: client,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la récupération du client." });
    }
  }

  static async createClient(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Récupérer l'ID de l'utilisateur connecté à partir du token
      const userId = req.user.id;

      const { email, telephone } = req.body;

      // Vérifie si l'utilisateur existe avec l'ID de l'utilisateur connecté
      const existingUser = await prisma.utilisateur.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          message: "L'utilisateur associé n'existe pas.",
        });
      }

      const existingClient = await prisma.client.findFirst({
        where: { OR: [{ email }, { telephone }] },
      });
      if (existingClient) {
        return res.status(400).json({
          message: "Un client avec cet email ou ce numéro de téléphone existe déjà.",
        });
      }

      // Créer un client avec l'ID de l'utilisateur connecté
      const client = await prisma.client.create({
        data: {
          ...req.body,
          id_utilisateur: userId,
        },
      });
      res.status(201).json({
        message: "Client ajouté avec succès.",
        data: client,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de l'ajout du client." });
    }
  }

  static async updateClient(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, telephone } = req.body;
      const existingClient = await prisma.client.findUnique({
        where: { id: Number(req.params.id) },
      });
      
      if (!existingClient) {
        return res.status(404).json({ 
          message: "Client non trouvé avec cet ID."
        });
      }

      const duplicateClient = await prisma.client.findFirst({
        where: {
          OR: [{ email }, { telephone }],
          NOT: { id: Number(req.params.id) },
        },
      });

      if (duplicateClient) {
        return res.status(400).json({
          message: "Un autre client avec cet email ou ce numéro de téléphone existe déjà.",
        });
      }

      const updatedClient = await prisma.client.update({
        where: { id: Number(req.params.id) },
        data: req.body,
      });

      res.json({
        message: "Client mis à jour avec succès.",
        data: updatedClient,
      });
    } catch (error) {
      next({ status: 500, message: "Erreur lors de la mise à jour du client." });
    }
  }

  static async deleteClient(req, res, next) {
    try {
      const clientId = Number(req.params.id);
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
      });
      
      if (!existingClient) {
        return res.status(404).json({ 
          message: "Client non trouvé avec cet ID." 
        });
      }
      const associatedFactures = await prisma.facture.findFirst({
        where: { id_client: clientId },
      });

      if (associatedFactures) {
        return res.status(400).json({
          message: "Impossible de supprimer ce client car il est associé à une ou plusieurs factures. Veuillez d'abord supprimer les factures associées.",
        });
      }
      await prisma.client.delete({
        where: { id: clientId },
      });
  
      res.json({
        message: "Client supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      next({ status: 500, message: "Erreur lors de la suppression du client." });
    }
  }
  
}
