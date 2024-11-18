import express from 'express';
import PaiementController from '../controllers/paiementController.js';
import PaiementValidator from '../validators/paiementValidator.js';


const router = express.Router();

router.get('/', PaiementController.getAllPaiements);
router.get('/:id', PaiementController.getPaiementById);
router.post('/', PaiementValidator.validateCreatePaiement(), PaiementController.createPaiement);
router.put('/:id', PaiementValidator.validateUpdatePaiement(), PaiementController.updatePaiement);
router.delete('/:id', PaiementValidator.validateDeletePaiement(), PaiementController.deletePaiement);

export default router;
