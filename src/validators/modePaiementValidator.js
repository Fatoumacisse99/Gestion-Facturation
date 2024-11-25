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
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Le libellé ne doit contenir que des lettres et des espaces.")
  .custom(async (value) => {
    const existingMode = await prisma.modePaiement.findFirst({
      where: { libelle: value },
    });
    if (existingMode) {
      throw new Error("Ce libellé de mode de paiement existe déjà!");
    }
    return true;
  })
      
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
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("Le libellé ne doit contenir que des lettres et des espaces.")
        // .custom(async (value, { req }) => {
        //   if (value) {
        //     const existingMode = await prisma.modePaiement.findFirst({
        //       where: { libelle: value },
        //     });
        //     if (existingMode) {
        //       throw new Error("Ce libellé de mode de paiement existe déjà!");
        //     }
        //   }
        //   return true; 
        // }),
      
      
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
