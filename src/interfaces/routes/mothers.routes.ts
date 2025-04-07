import { Router } from 'express';
import { mothersController } from '../dependencies';

const router = Router();

router.post('/', mothersController.createMother.bind(mothersController));
router.get('/', mothersController.getAllMothers.bind(mothersController));
router.get('/:id', mothersController.getMotherById.bind(mothersController));
router.put('/:id', mothersController.updateMother.bind(mothersController));
router.delete('/:id', mothersController.deleteMother.bind(mothersController));

export const mothersRoutes = router;
