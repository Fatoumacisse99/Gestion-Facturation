import express from 'express';
import clientController from '../controllers/clientController.js';
import ClientValidator from '../validators/clientValidator.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import errorHandler from '../middlewares/validationHandler.js';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  clientController.getAllClients
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  ClientValidator.validateDeleteClient(),
  clientController.getClientById
);

router.post(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  ClientValidator.validateCreateClient(),
  clientController.createClient
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  clientController.updateClient
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  ClientValidator.validateDeleteClient(),
  clientController.deleteClient
);

export default router;
