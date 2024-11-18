import { body, validationResult } from 'express-validator';

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Un email valide est requis.')
    .isLength({ max: 100 })
    .withMessage('L\'email ne peut pas dépasser 100 caractères.'),
  body('mot_de_passe')
    .notEmpty()
    .withMessage('Le mot de passe est requis.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
