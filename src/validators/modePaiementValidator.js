// validators/modePaiementValidator.js
import { check, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ModePaiementValidator {
  static validateCreateModePaiement() {
    return [
      check("libelle")
        .notEmpty()
        .withMessage("Le libellé est requis!")
        .isLength({ max: 50 })
        .withMessage("Le libellé ne doit pas dépasser 50 caractères!")
        .custom(async (value) => {
          // Utiliser findFirst pour vérifier l'existence par libelle
          const existingMode = await prisma.modePaiement.findFirst({
            where: { libelle: value },
          });
          if (existingMode) {
            throw new Error("Ce libellé de mode de paiement existe déjà!");
          }
          return true; // Si tout est OK, renvoyez true
        }),

      check("id_utilisateur")
        .notEmpty()
        .withMessage("L'ID de l'utilisateur est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID de l'utilisateur doit être un entier positif!"),
    ];
  }

  static validateUpdateModePaiement() {
    return [
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour mettre à jour un mode de paiement!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif!"),

      check("libelle")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Le libellé ne doit pas dépasser 50 caractères!")
        .custom(async (value, { req }) => {
          // Vérifier si un nouveau libellé est fourni et s'il existe déjà
          if (value) {
            const existingMode = await prisma.modePaiement.findFirst({
              where: { libelle: value },
            });
            if (existingMode) {
              throw new Error("Ce libellé de mode de paiement existe déjà!");
            }
          }
          return true; // Si tout est OK, renvoyez true
        }),
      
      check("id_utilisateur").optional().isInt({ gt: 0 }).withMessage("L'ID de l'utilisateur doit être un entier positif!"),
    ];
  }

  static validateDeleteModePaiement() {
    return [
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour supprimer un mode de paiement!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }
}

export default ModePaiementValidator;
