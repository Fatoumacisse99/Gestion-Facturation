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
        .isDecimal({ decimal_digits: '0,2', force_decimal: false })
        .withMessage("Le montant payé doit être un nombre décimal valide!")
        .custom((value) => value > 0)
        .withMessage("Le montant payé doit être supérieur à 0!"),

      check("id_mode_paiement")
        .notEmpty()
        .withMessage("L'ID du mode de paiement est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID du mode de paiement doit être un entier positif!"),


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
        .notEmpty()
        .withMessage("Le montant payé est requis!")
        .isDecimal({ decimal_digits: '0,2', force_decimal: false })
        .withMessage("Le montant payé doit être un nombre décimal valide!")
        .custom((value) => value > 0)
        .withMessage("Le montant payé doit être supérieur à 0!"),
      check("id_mode_paiement").optional().isInt({ gt: 0 }).withMessage("L'ID du mode de paiement doit être un entier positif!"),
      check("id_utilisateur").optional().isInt({ gt: 0 }).withMessage("L'ID de l'utilisateur doit être un entier positif!"),
      check("id_facture").optional().isInt({ gt: 0 }).withMessage("L'ID de la facture doit être un entier positif!"),
    ];
  }
  static validateGetPaiementById() {
    return [
      param('id')
        .notEmpty()
        .withMessage("L'ID est requis pour récupérer un paiement!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif!"),
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
