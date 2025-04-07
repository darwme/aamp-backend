import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authController } from '../dependencies';

const router = Router();

const controller = authController;

router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));
router.post('/verify-token', controller.verifyToken.bind(controller));

export const authRoutes = router;
