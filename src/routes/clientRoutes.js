// import express from 'express';
// import clientController from '../controllers/clientController.js';
// import ClientValidator from '../validators/clientValidator.js';

// const router = express.Router();

// router.get('/', clientController.getAllClients);
// router.get('/:id', ClientValidator.validateDeleteClient(), clientController.getClientById);
// router.post('/', ClientValidator.validateCreateClient(), clientController.createClient);
// router.put('/:id', ClientValidator.validateUpdateClient(), clientController.updateClient);
// router.delete('/:id', ClientValidator.validateDeleteClient(), clientController.deleteClient);

// export default router;
import express from 'express';
import clientController from '../controllers/clientController.js';
import ClientValidator from '../validators/clientValidator.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

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
  authorizeRole(['ADMIN', 'COMPTABLE']), // Autorisé pour Admin et Comptable
  ClientValidator.validateCreateClient(),
  clientController.createClient
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']), // Autorisé pour Admin et Comptable
  ClientValidator.validateUpdateClient(),
  clientController.updateClient
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']), // Autorisé pour Admin et Comptable
  ClientValidator.validateDeleteClient(),
  clientController.deleteClient
);

export default router;
