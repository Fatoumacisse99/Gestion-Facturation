import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default class FactureController {
  static async getAllFactures(_req, res, next) {
    try {
      const factures = await prisma.facture.findMany({
        include: { LigneFacture: true },
      });
      res.json({
        message: "Liste des factures récupérée avec succès.",
        data: factures,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, message: "Erreur lors de la récupération des factures." });
    }
  }
  static async getFactureById(req, res, next) {
    try {
      const facture = await prisma.facture.findUnique({
        where: { id: Number(req.params.id) },
        include: { LigneFacture: true ,client: true}, 
      });
      if (!facture) {
        return res.status(404).json({ message: "Facture non trouvée avec cet ID." });
      }
      res.json({
        message: "Facture récupérée avec succès.",
        data: facture,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, message: "Erreur lors de la récupération de la facture." });
    }
  }
  static async createFacture(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { date_emission, id_client, date_echeance, lignes } = req.body;
      const id_utilisateur = req.user.id;
  
      // Vérifier si le client existe
      const existingClient = await prisma.client.findUnique({
        where: { id: Number(id_client) },
      });
      if (!existingClient) {
        return res.status(400).json({ message: "Le client spécifié n'existe pas." });
      }
  
      // Vérifier si les lignes de facture sont valides
      if (!lignes || lignes.length === 0) {
        return res.status(400).json({ message: "Vous devez ajouter au moins une ligne de facture." });
      }
  
      // // Vérifier si une facture identique existe déjà
      // const similarFacture = await prisma.facture.findFirst({
      //   where: {
      //     id_client: Number(id_client),
      //     date_emission: new Date(date_emission),
      //   },
      //   include: { LigneFacture: true },
      // });
  
      // if (
      //   similarFacture &&
      //   similarFacture.LigneFacture.length === lignes.length &&
      //   similarFacture.LigneFacture.every((existingLigne, index) => {
      //     const newLigne = lignes[index];
      //     return (
      //       existingLigne.nom === newLigne.nom &&
      //       existingLigne.quantite === newLigne.quantite &&
      //       existingLigne.prix_unitaire === newLigne.prix_unitaire
      //     );
      //   })
      // ) {
      //   return res
      //     .status(400)
      //     .json({ message: "Une facture identique avec ces détails existe déjà." });
      // }
  
      // Calculer le montant total
      const montant_total = lignes.reduce(
        (total, ligne) => total + ligne.quantite * ligne.prix_unitaire,
        0
      );
  
      // Créer la facture
      const facture = await prisma.facture.create({
        data: {
          date_emission: new Date(date_emission),
          date_echeance: new Date(date_echeance),
          montant: montant_total.toFixed(2),
          id_utilisateur: Number(id_utilisateur),
          id_client: Number(id_client),
          pourcentage_paiement: 0,
          LigneFacture: {
            create: lignes.map((ligne) => ({
              nom: ligne.nom,
              quantite: ligne.quantite,
              prix_unitaire: ligne.prix_unitaire,
              montant_ligne: parseFloat((ligne.quantite * ligne.prix_unitaire).toFixed(2)),
            })),
          },
        },
        include: { LigneFacture: true, client: true },
      });
  
      // Répondre avec succès
      res.status(201).json({
        message: "Facture ajoutée avec succès.",
        data: facture,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture :", error);
      next({ status: 500, message: "Erreur interne du serveur." });
    }
  }
  

  static async updateFacture(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingFacture = await prisma.facture.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingFacture) {
        return res.status(404).json({ message: "Facture non trouvée avec cet ID." });
      }

      const { date_emission, date_echeance, lignes } = req.body;

      if (!lignes || lignes.length === 0) {
        return res.status(400).json({ message: "Vous devez ajouter au moins une ligne de facture." });
      }

      const montant_total = lignes.reduce((total, ligne) => total + (ligne.quantite * ligne.prix_unitaire), 0);

      const facture = await prisma.facture.update({
        where: { id: Number(req.params.id) },
        data: {
          date_emission: new Date(date_emission),
          date_echeance: new Date(date_echeance),
          montant: montant_total.toFixed(2),
          LigneFacture: {
            deleteMany: {},
            create: lignes.map(ligne => ({
              nom: ligne.nom,
              quantite: ligne.quantite,
              prix_unitaire: ligne.prix_unitaire,
              montant_ligne: parseFloat((ligne.quantite * ligne.prix_unitaire).toFixed(2)),
            })),
          },
        },
      });

      res.json({
        message: "Facture mise à jour avec succès.",
        data: facture,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, message: "Erreur lors de la mise à jour de la facture." });
    }
  }

  static async deleteFacture(req, res, next) {
    try {
      
      const factureId = Number(req.params.id);
  
      // Vérifier l'existence de la facture
      const existingFacture = await prisma.facture.findUnique({
        where: { id: factureId },
      });
  
      if (!existingFacture) {
        return res.status(404).json({ message: "Facture non trouvée avec cet ID." });
      }
  
      // Vérifier si la facture est liée à des paiements
      const relatedPaiements = await prisma.paiement.findFirst({
        where: { id_facture: factureId },
      });
  
      if (relatedPaiements) {
        return res.status(400).json({
          message: "Impossible de supprimer cette facture car elle est liée à des paiements.",
        });
      }
  
      // Suppression de la facture
      await prisma.facture.delete({
        where: { id: factureId },
      });
  
      res.json({
        message: "Facture supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture :", error);
      next({ status: 500, message: "Erreur lors de la suppression de la facture." });
    }
  }
  

  static async getAllLignesFacture(_req, res, next) {
    console.log("getAllLignesFacture called");
    try {
      const lignes = await prisma.ligneFacture.findMany();
      res.json({
        message: "Lignes de facture récupérées avec succès.",
        data: lignes,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des lignes de facture :", error);
      next({ status: 500, message: "Erreur lors de la récupération des lignes de facture." });
    }
  }

  static async addLigneFacture(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id_facture, nom, quantite, prix_unitaire } = req.body;
      const existingFacture = await prisma.facture.findUnique({
        where: { id: Number(id_facture) },
      });
      if (!existingFacture) {
        return res.status(404).json({ message: "La facture associée n'existe pas." });
      }
      const existingLigne = await prisma.ligneFacture.findFirst({
        where: {
          id_facture: Number(id_facture),
          nom: nom,
          quantite: quantite,
          prix_unitaire: prix_unitaire,
        },
      });

      if (existingLigne) {
        return res.status(400).json({ message: "Cette ligne de facture existe déjà pour cette facture." });
      }

      const ligne = await prisma.ligneFacture.create({
        data: {
          nom,
          quantite,
          prix_unitaire,
          montant_ligne: parseFloat((quantite * prix_unitaire).toFixed(2)),
          id_facture: Number(id_facture),
        },
      });

      res.status(201).json({
        message: "Ligne de facture ajoutée avec succès.",
        data: ligne,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la ligne de facture :", error);
      next({ status: 500, message: "Erreur lors de l'ajout de la ligne de facture." });
    }
  }

  static async updateLigneFacture(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
    
      const existingLigne = await prisma.ligneFacture.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingLigne) {
        return res.status(404).json({ message: "Ligne de facture non trouvée." });
      }

      const ligne = await prisma.ligneFacture.update({
        where: { id: Number(req.params.id) },
        data: req.body,
      });

      res.json({
        message: "Ligne de facture mise à jour avec succès.",
        data: ligne,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la ligne de facture :", error);
      next({ status: 500, message: "Erreur lors de la mise à jour de la ligne de facture." });
    }
  }

static async deleteLigneFacture(req, res, next) {
  try {
      const ligneId = Number(req.params.id);
      const ligne = await prisma.ligneFacture.findUnique({
          where: { id: ligneId },
      });

      if (!ligne) {
          return res.status(404).json({ message: "Ligne de facture non trouvée." });
      }
      const factureId = ligne.id_facture;
      await prisma.ligneFacture.delete({
          where: { id: ligneId },
      });
      const lignesRestantes = await prisma.ligneFacture.findMany({
          where: { id_facture: factureId },
      });
      
      const nouveauMontantTotal = lignesRestantes.reduce((total, ligne) => {
          return total + ligne.montant_ligne;
      }, 0);
      await prisma.facture.update({
          where: { id: factureId },
          data: { montant: nouveauMontantTotal.toFixed(2) },
      });

      res.json({
          message: "Ligne de facture supprimée avec succès et montant de la facture mis à jour.",
      });
  } catch (error) {
      console.error("Erreur lors de la suppression de la ligne de facture :", error);
      next({ status: 500, message: "Erreur lors de la suppression de la ligne de facture." });
  }
}


}