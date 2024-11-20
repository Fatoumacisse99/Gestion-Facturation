
// import { validationResult } from 'express-validator';
// import pkg from '@prisma/client'; 
// const { PrismaClient, Decimal } = pkg;

// const prisma = new PrismaClient();

// export default class PaiementController {
//   static async getAllPaiements(_req, res, next) {
//     try {
//       const paiements = await prisma.paiement.findMany();
//       res.json({
//         message: "Liste des paiements récupérée avec succès.",
//         data: paiements,
//       });
//     } catch (error) {
//       console.error(error);
//       next({ status: 500, message: "Erreur lors de la récupération des paiements." });
//     }
//   }

//   static async getPaiementById(req, res, next) {
//     try {
//       const paiement = await prisma.paiement.findUnique({
//         where: { id: Number(req.params.id) },
//       });
//       if (!paiement) {
//         return res.status(404).json({ message: "Paiement non trouvé avec cet ID." });
//       }
//       res.json({
//         message: "Paiement récupéré avec succès.",
//         data: paiement,
//       });
//     } catch (error) {
//       console.error(error);
//       next({ status: 500, message: "Erreur lors de la récupération du paiement." });
//     }
//   }

//   static async createPaiement(req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { montant_paye, id_facture, date_paiement, id_mode_paiement, id_utilisateur } = req.body;

//       const facture = await prisma.facture.findUnique({
//         where: { id: Number(id_facture) },
//       });
//       if (!facture) {
//         return res.status(404).json({ message: "La facture spécifiée n'existe pas." });
//       }

//       const paiementsExistants = await prisma.paiement.findMany({
//         where: { id_facture: Number(id_facture) },
//       });
//       const montantDejaPaye = paiementsExistants.reduce(
//         (total, paiement) => total + parseFloat(paiement.montant_paye),
//         0
//       );

//       const montantPayeActuel = parseFloat(montant_paye);
//       if (isNaN(montantPayeActuel)) {
//         return res.status(400).json({ message: "Montant invalide. Veuillez entrer un nombre valide." });
//       }

//       if (montantDejaPaye + montantPayeActuel > parseFloat(facture.montant)) {
//         return res.status(400).json({ message: "Le montant cumulé des paiements dépasse le total de la facture." });
//       }

//       const modePaiement = await prisma.modePaiement.findUnique({ where: { id: Number(id_mode_paiement) } });
//       if (!modePaiement) {
//         return res.status(404).json({ message: "Le mode de paiement spécifié n'existe pas." });
//       }

//       const utilisateur = await prisma.utilisateur.findUnique({ where: { id: Number(id_utilisateur) } });
//       if (!utilisateur) {
//         return res.status(404).json({ message: "L'utilisateur spécifié n'existe pas." });
//       }

//       // Création du paiement
//       const paiement = await prisma.paiement.create({
//         data: {
//           montant_paye: new Decimal(montantPayeActuel.toFixed(2)),
//           date_paiement: new Date(date_paiement),
//           facture: { connect: { id: Number(id_facture) } },
//           modePaiement: { connect: { id: Number(id_mode_paiement) } },
//           utilisateur: { connect: { id: Number(id_utilisateur) } },
//         },
//       });
//       const montantTotalPaye = montantDejaPaye + montantPayeActuel;
//       const pourcentagePaiement = Math.min((montantTotalPaye / parseFloat(facture.montant)) * 100, 100);

//       await prisma.facture.update({
//         where: { id: Number(id_facture) },
//         data: { pourcentage_paiement: Math.round(pourcentagePaiement) },
//       });
//       const updatedFacture = await prisma.facture.findUnique({
//         where: { id: Number(id_facture) },
//         select: {
//           id: true,
//           montant: true,
//           pourcentage_paiement: true,
//         },
//       });

//       res.status(201).json({
//         message: "Paiement ajouté avec succès.",
//         data: paiement,
//         facture: updatedFacture,
//       });
//     } catch (error) {
//       console.error(error);
//       next({ status: 500, message: "Erreur lors de l'ajout du paiement." });
//     }
//   }

//   static async updatePaiement(req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const { montant_paye, date_paiement, id_mode_paiement, id_utilisateur, id_facture } = req.body;

//       const montantPaye = montant_paye ? parseFloat(montant_paye) : undefined;
//       if (montantPaye !== undefined && isNaN(montantPaye)) {
//         return res.status(400).json({ message: "Montant invalide. Veuillez entrer un nombre valide." });
//       }

//       const paiement = await prisma.paiement.update({
//         where: { id: Number(req.params.id) },
//         data: {
//           montant_paye: montantPaye ? new Decimal(montantPaye.toFixed(2)) : undefined,
//           date_paiement: date_paiement ? new Date(date_paiement) : undefined,
//           modePaiement: id_mode_paiement ? { connect: { id: Number(id_mode_paiement) } } : undefined,
//           utilisateur: id_utilisateur ? { connect: { id: Number(id_utilisateur) } } : undefined,
//           facture: id_facture ? { connect: { id: Number(id_facture) } } : undefined,
//         },
//       });

//       res.json({
//         message: "Paiement mis à jour avec succès.",
//         data: paiement,
//       });
//     } catch (error) {
//       console.error(error);
//       next({ status: 500, message: "Erreur lors de la mise à jour du paiement." });
//     }
//   }

//   static async deletePaiement(req, res, next) {
//     try {
//       const paiementId = Number(req.params.id);
  
//       // Suppression directe du paiement
//       await prisma.paiement.delete({
//         where: { id: paiementId },
//       });
  
//       res.json({ message: "Paiement supprimé avec succès." });
//     } catch (error) {
//       console.error("Erreur lors de la suppression du paiement :", error);
//       next({ status: 500, message: "Erreur lors de la suppression du paiement." });
//     }
//   }


// }
import { validationResult } from 'express-validator';
import pkg from '@prisma/client'; 
const { PrismaClient, Decimal } = pkg;

const prisma = new PrismaClient();

export default class PaiementController {
  static async getAllPaiements(_req, res, next) {
    try {
      const paiements = await prisma.paiement.findMany();
      res.json({
        message: "Liste des paiements récupérée avec succès.",
        data: paiements,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, message: "Erreur lors de la récupération des paiements." });
    }
  }

  static async getPaiementById(req, res, next) {
    try {
      const paiement = await prisma.paiement.findUnique({
        where: { id: Number(req.params.id) },
      });
      if (!paiement) {
        return res.status(404).json({ message: "Paiement non trouvé avec cet ID." });
      }
      res.json({
        message: "Paiement récupéré avec succès.",
        data: paiement,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, message: "Erreur lors de la récupération du paiement." });
    }
  }

  static async createPaiement(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { montant_paye, id_facture, date_paiement, id_mode_paiement } = req.body;
      const id_utilisateur = req.user?.id; 0

      if (!id_utilisateur) {
        return res.status(400).json({ message: "Utilisateur non authentifié." });
      }

      const facture = await prisma.facture.findUnique({
        where: { id: Number(id_facture) },
      });
      if (!facture) {
        return res.status(404).json({ message: "La facture spécifiée n'existe pas." });
      }

      const paiementsExistants = await prisma.paiement.findMany({
        where: { id_facture: Number(id_facture) },
      });
      const montantDejaPaye = paiementsExistants.reduce(
        (total, paiement) => total + parseFloat(paiement.montant_paye),
        0
      );

      const montantPayeActuel = parseFloat(montant_paye);
      if (isNaN(montantPayeActuel)) {
        return res.status(400).json({ message: "Montant invalide. Veuillez entrer un nombre valide." });
      }

      if (montantDejaPaye + montantPayeActuel > parseFloat(facture.montant)) {
        return res.status(400).json({ message: "Le montant cumulé des paiements dépasse le total de la facture." });
      }

      const modePaiement = await prisma.modePaiement.findUnique({ where: { id: Number(id_mode_paiement) } });
      if (!modePaiement) {
        return res.status(404).json({ message: "Le mode de paiement spécifié n'existe pas." });
      }

      // Création du paiement
      const paiement = await prisma.paiement.create({
        data: {
          montant_paye: new Decimal(montantPayeActuel.toFixed(2)),
          date_paiement: new Date(date_paiement),
          facture: { connect: { id: Number(id_facture) } },
          modePaiement: { connect: { id: Number(id_mode_paiement) } },
          utilisateur: { connect: { id: Number(id_utilisateur) } },
        },
      });

      const montantTotalPaye = montantDejaPaye + montantPayeActuel;
      const pourcentagePaiement = Math.min((montantTotalPaye / parseFloat(facture.montant)) * 100, 100);

      await prisma.facture.update({
        where: { id: Number(id_facture) },
        data: { pourcentage_paiement: Math.round(pourcentagePaiement) },
      });

      const updatedFacture = await prisma.facture.findUnique({
        where: { id: Number(id_facture) },
        select: {
          id: true,
          montant: true,
          pourcentage_paiement: true,
        },
      });

      res.status(201).json({
        message: "Paiement ajouté avec succès.",
        data: paiement,
        facture: updatedFacture,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, message: "Erreur lors de l'ajout du paiement." });
    }
  }

  static async updatePaiement(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { montant_paye, date_paiement, id_mode_paiement, id_utilisateur, id_facture } = req.body;
  
      // Vérifiez si le paiement existe
      const paiement = await prisma.paiement.findUnique({
        where: { id: Number(req.params.id) },
      });
  
      if (!paiement) {
        return res.status(404).json({ message: "Paiement non trouvé avec cet ID." });
      }
  
      // Vérifiez si la facture existe avant de la connecter
      if (id_facture) {
        const facture = await prisma.facture.findUnique({
          where: { id: Number(id_facture) },
        });
  
        if (!facture) {
          return res.status(404).json({ message: "La facture spécifiée n'existe pas." });
        }
      }
  
      // Vérifiez si le mode de paiement existe avant de le connecter
      if (id_mode_paiement) {
        const modePaiement = await prisma.modePaiement.findUnique({
          where: { id: Number(id_mode_paiement) },
        });
  
        if (!modePaiement) {
          return res.status(404).json({ message: "Le mode de paiement spécifié n'existe pas." });
        }
      }
  
      // Vérifiez si l'utilisateur existe avant de le connecter
      if (id_utilisateur) {
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { id: Number(id_utilisateur) },
        });
  
        if (!utilisateur) {
          return res.status(404).json({ message: "L'utilisateur spécifié n'existe pas." });
        }
      }
  
      const montantPaye = montant_paye ? parseFloat(montant_paye) : undefined;
      if (montantPaye !== undefined && isNaN(montantPaye)) {
        return res.status(400).json({ message: "Montant invalide. Veuillez entrer un nombre valide." });
      }
  
      const updatedPaiement = await prisma.paiement.update({
        where: { id: Number(req.params.id) },
        data: {
          montant_paye: montantPaye ? new Decimal(montantPaye.toFixed(2)) : undefined,
          date_paiement: date_paiement ? new Date(date_paiement) : undefined,
          modePaiement: id_mode_paiement ? { connect: { id: Number(id_mode_paiement) } } : undefined,
          utilisateur: id_utilisateur ? { connect: { id: Number(id_utilisateur) } } : undefined,
          facture: id_facture ? { connect: { id: Number(id_facture) } } : undefined,
        },
      });
  
      res.json({
        message: "Paiement mis à jour avec succès.",
        data: updatedPaiement,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement :", error);
      next({ status: 500, message: "Erreur lors de la mise à jour du paiement." });
    }
  }
  
  
  static async deletePaiement(req, res, next) {
    try {
      const paiementId = Number(req.params.id);
      const paiement = await prisma.paiement.findUnique({
        where: { id: paiementId },
      });
  
      if (!paiement) {
        return res.status(404).json({ message: "Paiement non trouvé avec cet ID." });
      }
  
      // Supprimer le paiement
      await prisma.paiement.delete({
        where: { id: paiementId },
      });
  
      res.json({ message: "Paiement supprimé avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement :", error);
      next({ status: 500, message: "Erreur lors de la suppression du paiement." });
    }
  }
  
  }

