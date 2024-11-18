import express from 'express';
import ModePaiementController from '../controllers/modePaiementController.js';
import ModePaiementValidator from '../validators/modePaiementValidator.js';

const router = express.Router();

router.get('/', ModePaiementController.getAllModesPaiement);
router.get('/:id', ModePaiementController.getModePaiementById);
router.post('/', ModePaiementValidator.validateCreateModePaiement(), ModePaiementController.createModePaiement);
router.put('/:id', ModePaiementValidator.validateUpdateModePaiement(), ModePaiementController.updateModePaiement);
router.delete('/:id', ModePaiementValidator.validateDeleteModePaiement(), ModePaiementController.deleteModePaiement);

export default router;
