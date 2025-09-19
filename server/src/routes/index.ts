import { Router } from 'express';
import authRoutes from './auth';
import usuarioRoutes from './usuarios';
import claseRoutes from './clases';
import nivelRoutes from './niveles';
import moduloRoutes from './modulos';
import leccionRoutes from './lecciones';
import progresoRoutes from './progresos';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/clases', claseRoutes);
router.use('/niveles', nivelRoutes);
router.use('/modulos', moduloRoutes);
router.use('/lecciones', leccionRoutes);
router.use('/progresos', progresoRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-Learning API is running' });
});

export default router;