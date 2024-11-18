// validators/paiementValidator.js
import { check, param } from 'express-validator';

class PaiementValidator {
  static validateCreatePaiement() {
    return [
      check("date_paiement")
        .notEmpty()
        .withMessage("La date de paiement est requise!"),

      check("montant_paye")
        .notEmpty()
        .withMessage("Le montant payé est requis!")
        .isDecimal()
        .withMessage("Le montant payé doit être un nombre décimal!"),

      check("id_mode_paiement")
        .notEmpty()
        .withMessage("L'ID du mode de paiement est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID du mode de paiement doit être un entier positif!"),

      check("id_utilisateur")
        .notEmpty()
        .withMessage("L'ID de l'utilisateur est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID de l'utilisateur doit être un entier positif!"),

      check("id_facture")
        .notEmpty()
        .withMessage("L'ID de la facture est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID de la facture doit être un entier positif!"),
    ];
  }

  static validateUpdatePaiement() {
    return [
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour mettre à jour un paiement!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif!"),

      check("date_paiement").optional(),
      check("montant_paye")
        .optional()
        .isDecimal()
        .withMessage("Le montant payé doit être un nombre décimal!"),
      check("id_mode_paiement").optional().isInt({ gt: 0 }).withMessage("L'ID du mode de paiement doit être un entier positif!"),
      check("id_utilisateur").optional().isInt({ gt: 0 }).withMessage("L'ID de l'utilisateur doit être un entier positif!"),
      check("id_facture").optional().isInt({ gt: 0 }).withMessage("L'ID de la facture doit être un entier positif!"),
    ];
  }

  static validateDeletePaiement() {
    return [
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour supprimer un paiement!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }
}

export default PaiementValidator;
