import { Router } from 'express';
import { DniController } from '../controllers/dni.controller';
import { DniService } from '../../infrastructure/services/dni.service'; 
const router = Router();
const dniService = new DniService();
const dniController = new DniController(dniService); 

router.get('/:numeroDocumento', (req, res) => dniController.getDni(req, res));

export default router;