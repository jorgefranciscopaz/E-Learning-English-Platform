import { Router } from 'express';
import { getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson } from '../controllers/lessonController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllLessons);
router.get('/:id', authenticateToken, getLessonById);
router.post('/', authenticateToken, requireRole(['teacher', 'admin']), createLesson);
router.put('/:id', authenticateToken, requireRole(['teacher', 'admin']), updateLesson);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteLesson);

export default router;