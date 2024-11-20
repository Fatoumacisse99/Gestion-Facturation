// import express from 'express';
// import {
//   login,
//   requestPasswordReset,
//   resetPassword,
//   resetPasswordPage,
// } from '../controllers/authController.js';

// const router = express.Router();

// // Route pour la connexion
// router.post('/login', login);

// // Route pour demander un lien de réinitialisation de mot de passe
// router.post('/request-password-reset', requestPasswordReset);
// router.get('/reset-password', resetPasswordPage);

// // Route pour réinitialiser le mot de passe
// router.post('/reset-password', resetPassword);

// export default router;
import express from 'express';
import {
  login,
  requestPasswordReset,
  resetPassword,
  resetPasswordPage,
} from '../controllers/authController.js';

const router = express.Router();

// Route pour la connexion
router.post('/login', login);

// Route pour demander un lien de réinitialisation de mot de passe
router.post('/request-password-reset', requestPasswordReset);

// Route pour afficher la page de réinitialisation de mot de passe
router.get('/reset-password', resetPasswordPage);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', resetPassword);

export default router;
