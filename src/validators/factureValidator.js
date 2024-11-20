// validators/factureValidator.js
import { check, param } from 'express-validator';

class FactureValidator {
  static validateCreateFacture() {
    return [
      check('id_client')
        .notEmpty()
        .withMessage("L'ID du client est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID du client doit être un entier positif!"),

      check('date_emission')
        .notEmpty()
        .withMessage("La date d'émission est requise!")
        .isISO8601()
        .withMessage("La date d'émission doit être au format ISO 8601."),

      check('date_echeance')
        .notEmpty()
        .withMessage("La date d'échéance est requise!")
        .isISO8601()
        .withMessage("La date d'échéance doit être au format ISO 8601."),

      check('lignes')
        .isArray({ min: 1 })
        .withMessage("Vous devez ajouter au moins une ligne de facture!"),

      check('lignes.*.quantite')
        .notEmpty()
        .withMessage("La quantité est requise!")
        .isInt({ gt: 0 })
        .withMessage("La quantité doit être un entier positif!"),

      check('lignes.*.prix_unitaire')
        .notEmpty()
        .withMessage("Le prix unitaire est requis!")
        .isFloat({ gt: 0 })
        .withMessage("Le prix unitaire doit être un nombre positif!"),

      check('lignes.*.nom')
        .notEmpty()
        .withMessage("Le nom de l'article est requis!")
    ];
  }

  static validateUpdateFacture() {
    return [
      param('id')
        .notEmpty()
        .withMessage("L'ID est requis pour mettre à jour une facture!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif!"),

      check('id_client')
        .optional()
        .isInt({ gt: 0 })
        .withMessage("L'ID du client doit être un entier positif."),

      check('date_emission')
        .optional()
        .isISO8601()
        .withMessage("La date d'émission doit être au format ISO 8601."),

      check('date_echeance')
        .optional()
        .isISO8601()
        .withMessage("La date d'échéance doit être au format ISO 8601."),

      check('lignes')
        .optional()
        .isArray({ min: 1 })
        .withMessage("Vous devez ajouter au moins une ligne de facture!"),

      check('lignes.*.quantite')
        .optional()
        .notEmpty()
        .withMessage("La quantité est requise!")
        .isInt({ gt: 0 })
        .withMessage("La quantité doit être un entier positif!"),

      check('lignes.*.prix_unitaire')
        .optional()
        .notEmpty()
        .withMessage("Le prix unitaire est requis!")
        .isFloat({ gt: 0 })
        .withMessage("Le prix unitaire doit être un nombre positif!"),

      check('lignes.*.nom')
        .optional()
        .notEmpty()
        .withMessage("Le nom de l'article est requis!")
    ];
  }


  static validateDeleteFacture() {
    return [
      param('id')
        .notEmpty()
        .withMessage("L'ID est requis pour supprimer une facture!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }

  static validateGetFactureById() {
    return [
      param('id')
        .notEmpty()
        .withMessage("L'ID est requis pour récupérer une facture!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }

  
  static validateAddLigneFacture() {
    return [
      check('id_facture')
        .notEmpty()
        .withMessage("L'ID de la facture est requis!")
        .isInt({ gt: 0 })
        .withMessage("L'ID de la facture doit être un entier positif."),

      check('nom')
        .notEmpty()
        .withMessage("Le nom du produit est requis!"),

      check('quantite')
        .notEmpty()
        .withMessage("La quantité est requise!")
        .isInt({ gt: 0 })
        .withMessage("La quantité doit être un entier positif."),

      check('prix_unitaire')
        .notEmpty()
        .withMessage("Le prix unitaire est requis!")
        .isNumeric()
        .withMessage("Le prix unitaire doit être un nombre."),
    ];
  }

  static validateUpdateLigneFacture() {
    return [
      param('id')
        .notEmpty()
        .withMessage("L'ID est requis pour mettre à jour une ligne de facture!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),

      check('nom')
        .optional()
        .notEmpty()
        .withMessage("Le nom du produit est requis!"),

      check('quantite')
        .optional()
        .isInt({ gt: 0 })
        .withMessage("La quantité doit être un entier positif."),

      check('prix_unitaire')
        .optional()
        .isNumeric()
        .withMessage("Le prix unitaire doit être un nombre."),
    ];
  }

  static validateDeleteLigneFacture() {
    return [
      param('id')
        .notEmpty()
        .withMessage("L'ID est requis pour supprimer une ligne de facture!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }
}
export default FactureValidator;
