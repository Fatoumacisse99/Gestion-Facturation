// // validators/utilisateurValidator.js
// import { check, param } from 'express-validator';

// class UserValidator {
//   static validateCreateUser() {
//     return [
//       check("nom")
//         .notEmpty()
//         .withMessage("Le nom est requis!")
//         .isLength({ max: 50 })
//         .withMessage("Le nom ne doit pas dépasser 50 caractères!")
//         .matches(/[a-zA-Z]/)
//         .withMessage("Le nom doit contenir au moins une lettre!"),


//       check("role")
//         .notEmpty()
//         .withMessage("Le rôle est requis!")
//         .isLength({ max: 50 })
//         .withMessage("Le rôle ne doit pas dépasser 50 caractères!"),

//       check("mot_de_passe")
//         .notEmpty()
//         .withMessage("Le mot de passe est requis!")
//         .isLength({ min: 6 })
//         .withMessage("Le mot de passe doit contenir au moins 6 caractères!"),

//       check("email")
//         .notEmpty()
//         .withMessage("L'email est requis!")
//         .isEmail()
//         .withMessage("L'email doit être valide!")
//         .isLength({ max: 100 })
//         .withMessage("L'email ne doit pas dépasser 100 caractères!"),

//       check("telephone")
//         .optional()
//         .isLength({ max: 12 })
//         .withMessage("Le numéro de téléphone ne doit pas dépasser 12 caractères!"),
//     ];
//   }

//   static validateUpdateUser() {
//     return [
//       check("nom").optional().isLength({ max: 50 }).withMessage("Le nom ne doit pas dépasser 50 caractères!"),
//       check("role").optional().isLength({ max: 50 }).withMessage("Le rôle ne doit pas dépasser 50 caractères!"),
//       check("mot_de_passe").optional().isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères!"),
//       check("email").optional().isEmail().withMessage("L'email doit être valide!").isLength({ max: 100 }).withMessage("L'email ne doit pas dépasser 100 caractères!"),
//       check("telephone").optional().isLength({ max: 12 }).withMessage("Le numéro de téléphone ne doit pas dépasser 12 caractères!"),
//     ];
//   }

//   static validateDeleteUser() {
//     return [
//       param("id")
//         .notEmpty()
//         .withMessage("L'ID est requis pour supprimer un utilisateur!")
//         .isInt({ gt: 0 })
//         .withMessage("L'ID doit être un entier positif."),
//     ];
//   }
// }

// export default UserValidator;
// // validators/utilisateurValidator.js
import { check, param } from 'express-validator';

class UserValidator {
  static validateCreateUser() {
    return [
      // Validation du champ "nom"
      check("nom")
        .notEmpty()
        .withMessage("Le nom est requis!")
        .isLength({ max: 50 })
        .withMessage("Le nom ne doit pas dépasser 50 caractères!")
        .matches(/[a-zA-Z]/)
        .withMessage("Le nom doit contenir au moins une lettre!"),

      // Validation du champ "role" (optionnel, valeurs spécifiques)
      check("role")
        .optional()
        .isIn(['ADMIN', 'COMPTABLE'])
        .withMessage("Le rôle doit être soit 'ADMIN' soit 'COMPTABLE'"),

      // Validation du champ "mot_de_passe"
      check("mot_de_passe")
        .notEmpty()
        .withMessage("Le mot de passe est requis!")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères!"),

      // Validation du champ "email"
      check("email")
        .notEmpty()
        .withMessage("L'email est requis!")
        .isEmail()
        .withMessage("L'email doit être valide!")
        .isLength({ max: 100 })
        .withMessage("L'email ne doit pas dépasser 100 caractères!"),

      
      // Validation du champ "statut" (optionnel)
      check("statut")
        .optional()
        .isBoolean()
        .withMessage("Le statut doit être un booléen (true ou false)!"),
    ];
  }

  static validateUpdateUser() {
    return [
      // Validation du champ "nom" (optionnel)
      check("nom")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Le nom ne doit pas dépasser 50 caractères!"),

      // Validation du champ "role" (optionnel, valeurs spécifiques)
      check("role")
        .optional()
        .isIn(['ADMIN', 'COMPTABLE'])
        .withMessage("Le rôle doit être soit 'ADMIN' soit 'COMPTABLE'"),

      // Validation du champ "mot_de_passe" (optionnel)
      check("mot_de_passe")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères!"),

      // Validation du champ "email" (optionnel)
      check("email")
        .optional()
        .isEmail()
        .withMessage("L'email doit être valide!")
        .isLength({ max: 100 })
        .withMessage("L'email ne doit pas dépasser 100 caractères!"),


      // Validation du champ "statut" (optionnel)
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
