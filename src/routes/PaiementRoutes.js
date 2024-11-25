import express from 'express';
import PaiementController from '../controllers/paiementController.js';
import PaiementValidator from '../validators/paiementValidator.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  PaiementController.getAllPaiements
);

router.get(
  '/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  PaiementValidator.validateGetPaiementById(), 
  PaiementController.getPaiementById
);

router.post(
  '/', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  PaiementValidator.validateCreatePaiement(), 
  PaiementController.createPaiement
);

router.put(
  '/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  PaiementValidator.validateUpdatePaiement(), 
  PaiementController.updatePaiement
);

router.delete(
  '/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  PaiementValidator.validateDeletePaiement(), 
  PaiementController.deletePaiement
);

export default router;


