import { Router } from 'express';
import authRoutes from './auth';
import lessonRoutes from './lessons';

const router = Router();

router.use('/auth', authRoutes);
router.use('/lessons', lessonRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-Learning API is running' });
});

export default router;