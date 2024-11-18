import express from 'express';
import factureController from '../controllers/factureController.js';
import FactureValidator from '../validators/factureValidator.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes pour les lignes de facture
router.get(
  '/lignes',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  factureController.getAllLignesFacture
);
router.post(
  '/lignes',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateAddLigneFacture(),
  factureController.addLigneFacture
);
router.put(
  '/lignes/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateUpdateLigneFacture(),
  factureController.updateLigneFacture
);
router.delete(
  '/lignes/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateDeleteLigneFacture(),
  factureController.deleteLigneFacture
);

// Routes pour les factures
router.get(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  factureController.getAllFactures
);
router.get(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateGetFactureById(),
  factureController.getFactureById
);
router.post(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateCreateFacture(),
  factureController.createFacture
);
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateUpdateFacture(),
  factureController.updateFacture
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN', 'COMPTABLE']),
  FactureValidator.validateDeleteFacture(),
  factureController.deleteFacture
);

export default router;
