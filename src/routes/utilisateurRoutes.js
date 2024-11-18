// import express from 'express';
// import utilisateurController from '../controllers/utilisateurController.js';
// import UserValidator from '../validators/utilisateurValidator.js';

// const router = express.Router();

// router.get('/', utilisateurController.getAllUsers);
// router.get('/:id', utilisateurController.getUserById);
// router.post('/', UserValidator.validateCreateUser(), utilisateurController.createUser);
// router.put('/:id', UserValidator.validateUpdateUser(), utilisateurController.updateUser);
// router.delete('/:id', UserValidator.validateDeleteUser(), utilisateurController.deleteUser);

// export default router;
import express from 'express';
import utilisateurController from '../controllers/utilisateurController.js';
import UserValidator from '../validators/utilisateurValidator.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole('ADMIN'),
  utilisateurController.getAllUsers
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  utilisateurController.getUserById
);

router.post(
  '/',
  authenticateToken,
  authorizeRole('ADMIN'),
  UserValidator.validateCreateUser(),
  utilisateurController.createUser
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  UserValidator.validateUpdateUser(),
  utilisateurController.updateUser
);

router.patch(
  '/status/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  utilisateurController.updateUserStatus
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  UserValidator.validateDeleteUser(),
  utilisateurController.deleteUser
);

export default router;
