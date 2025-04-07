import { Router } from 'express';
import { roleController } from '../dependencies';

const router = Router();

router.get('/:userId', roleController.getUserRoles.bind(roleController));

export const rolesRoutes = router;
