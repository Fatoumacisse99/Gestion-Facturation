import { check, param } from 'express-validator';

class UserValidator {
  static validateCreateUser() {
    return [

      check("nom")
  .notEmpty()
  .withMessage("Le nom ne peut pas être vide!")
  .isLength({ max: 50 })
  .withMessage("Le nom ne doit pas dépasser 50 caractères!")
  .matches(/^[a-zA-ZÀ-ÿ]+$/)
  .withMessage("Le nom doit contenir uniquement des lettres!"),
      check("role")
        .optional()
        .isIn(['ADMIN', 'COMPTABLE'])
        .withMessage("Le rôle doit être soit 'ADMIN' soit 'COMPTABLE'"),
        check("mot_de_passe")
        .notEmpty()
        .withMessage("Le mot de passe est requis!")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères!")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre!"),
      check("email")
        .notEmpty()
        .withMessage("L'email est requis!")
        .isEmail()
        .withMessage("L'email doit être valide!")
        .isLength({ max: 100 })
        .withMessage("L'email ne doit pas dépasser 100 caractères!"),
      ];
       }
  static validateUpdateUser() {
    return [
      check("nom")
  .notEmpty()
  .withMessage("Le nom ne peut pas être vide!")
  .isLength({ max: 50 })
  .withMessage("Le nom ne doit pas dépasser 50 caractères!")
  .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
  .withMessage("Le nom doit contenir uniquement des lettres et des espaces!"),

      check("role")
        .optional()
        .isIn(['ADMIN', 'COMPTABLE'])
        .withMessage("Le rôle doit être soit 'ADMIN' soit 'COMPTABLE'"),
        check("mot_de_passe")
        .notEmpty()
        .withMessage("Le mot de passe est requis!")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères!")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre!"),
      check("email")
        .optional()
        .isEmail()
        .withMessage("L'email doit être valide!")
        .isLength({ max: 100 })
        .withMessage("L'email ne doit pas dépasser 100 caractères!"),

      check("statut")
        .optional()
        .isBoolean()
        .withMessage("Le statut doit être un booléen (true ou false)!"),
    ];
  }

  static validateDeleteUser() {
    return [
      // Validation du paramètre "id"
      param("id")
        .notEmpty()
        .withMessage("L'ID est requis pour supprimer un utilisateur!")
        .isInt({ gt: 0 })
        .withMessage("L'ID doit être un entier positif."),
    ];
  }
}

export default UserValidator;
