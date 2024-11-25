import express from 'express';
import ModePaiementController from '../controllers/modePaiementController.js';
import ModePaiementValidator from '../validators/modePaiementValidator.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  ModePaiementController.getAllModesPaiement
);

router.get(
  '/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  ModePaiementController.getModePaiementById
);

router.post(
  '/', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  ModePaiementValidator.validateCreateModePaiement(), 
  ModePaiementController.createModePaiement
);

router.put(
  '/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']), 
  ModePaiementValidator.validateUpdateModePaiement(), 
  ModePaiementController.updateModePaiement
);

router.delete(
  '/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'COMPTABLE']),
  ModePaiementValidator.validateDeleteModePaiement(), 
  ModePaiementController.deleteModePaiement
);

export default router;

