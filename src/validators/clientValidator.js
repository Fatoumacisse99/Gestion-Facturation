// validators/clientValidator.js

import { check, param } from 'express-validator';

class ClientValidator {
  static validateCreateClient() {
    return [
      check("nom")
      .notEmpty()
      .withMessage("Le nom ne peut pas être vide!")
      .isLength({ max: 50 })
      .withMessage("Le nom ne doit pas dépasser 50 caractères!")
      .matches(/[a-zA-Z]/)
      .withMessage("Le nom doit contenir au moins une lettre!"),
    
    check("prenom")
      .notEmpty()
      .withMessage("Le prénom ne peut pas être vide!")
      .isLength({ max: 50 })
      .withMessage("Le prénom ne doit p!")
      .matches(/[a-zA-Z]/)
      .withMessage("Le prénom doit contenir au moins une lettre!"),

      check("email")
        .notEmpty()
        .withMessage("L'email est requis!")
        .isEmail()
        .withMessage("L'email doit être valide!")
        .isLength({ max: 100 })
        .withMessage("L'email ne doit pas dépasser 100 caractères!"),

        check("telephone")
      .notEmpty()
      .withMessage("Le numéro de téléphone est requis!")
      .isLength({ min: 8, max: 12 })
      .withMessage("Le numéro de téléphone doit contenir entre 8 et 12 caractères!")
      .isNumeric()
      .withMessage("Le numéro de téléphone ne doit contenir que des chiffres!"),

      check("adresse")
        .notEmpty()
        .withMessage("L'adresse est requise!")
        .isLength({ max: 50 })
        .withMessage("L'adresse ne doit pas dépasser 50 caractères!"),
    ];
  }

  static validateUpdateClient() {
    return [
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour mettre à jour un client!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif!"),

      check("nom").optional().isLength({ max: 50 }).withMessage("Le nom ne doit pas dépasser 50 caractères!"),
      check("prenom").optional().isLength({ max: 50 }).withMessage("Le prénom ne doit pas dépasser 50 caractères!"),
      check("email").optional().isEmail().withMessage("L'email doit être valide!").isLength({ max: 100 }).withMessage("L'email ne doit pas dépasser 100 caractères!"),
      check("telephone").optional().isLength({ max: 12 }).withMessage("Le numéro de téléphone ne doit pas dépasser 12 caractères!"),
      check("adresse").optional().isLength({ max: 50 }).withMessage("L'adresse ne doit pas dépasser 50 caractères!"),
      check("id_utilisateur").optional().isInt({ gt: 0 }).withMessage("L'ID de l'utilisateur doit être un entier positif!"),
    ];
  }
  static validateGetClient() {
    return [
      check('id')
        .notEmpty()
        .withMessage("L'ID du client est requis.")
        .isInt({ gt: 0 })
        .withMessage("L'ID du client doit être un entier positif."),
    ];}

  static validateDeleteClient() {
    return [
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour supprimer un client!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }
}

export default ClientValidator;
