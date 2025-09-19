import { Router } from 'express';
import {
  createOrUpdateProgreso,
  getMyProgress,
  getStudentProgress,
  getProgressStats,
  deleteProgreso
} from '../controllers/progresoController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Progreso:
 *       type: object
 *       required:
 *         - estudiante_id
 *         - leccion_id
 *       properties:
 *         estudiante_id:
 *           type: integer
 *           description: Student ID
 *         leccion_id:
 *           type: integer
 *           description: Lesson ID
 *         completado:
 *           type: boolean
 *           description: Whether lesson is completed
 *         puntaje:
 *           type: number
 *           format: decimal
 *           description: Score obtained (0-100)
 *         completado_en:
 *           type: string
 *           format: date-time
 *           description: Completion timestamp
 */

/**
 * @swagger
 * /api/progresos:
 *   post:
 *     summary: Create or update lesson progress (Students only)
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leccion_id
 *             properties:
 *               leccion_id:
 *                 type: integer
 *               completado:
 *                 type: boolean
 *               puntaje:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, requireRole(['estudiante']), createOrUpdateProgreso);

/**
 * @swagger
 * /api/progresos/my:
 *   get:
 *     summary: Get my progress (Students only)
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: modulo_id
 *         schema:
 *           type: integer
 *         description: Filter by module ID
 *       - in: query
 *         name: nivel_id
 *         schema:
 *           type: integer
 *         description: Filter by level ID
 *       - in: query
 *         name: completado
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Student's progress records
 */
router.get('/my', authenticateToken, requireRole(['estudiante']), getMyProgress);

/**
 * @swagger
 * /api/progresos/student/{studentId}:
 *   get:
 *     summary: Get student progress (Admin/Teacher)
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *       - in: query
 *         name: modulo_id
 *         schema:
 *           type: integer
 *         description: Filter by module ID
 *       - in: query
 *         name: completado
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Student's progress records
 *       404:
 *         description: Student not found
 */
router.get('/student/:studentId', authenticateToken, requireRole(['admin', 'docente']), getStudentProgress);

/**
 * @swagger
 * /api/progresos/stats:
 *   get:
 *     summary: Get my progress statistics (Students only)
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress statistics including completion percentage and average score
 */
router.get('/stats', authenticateToken, requireRole(['estudiante']), getProgressStats);

/**
 * @swagger
 * /api/progresos/stats/{studentId}:
 *   get:
 *     summary: Get student progress statistics (Admin/Teacher)
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student's progress statistics
 *       400:
 *         description: Student ID is required
 */
router.get('/stats/:studentId', authenticateToken, requireRole(['admin', 'docente']), getProgressStats);

/**
 * @swagger
 * /api/progresos/{leccionId}:
 *   delete:
 *     summary: Delete lesson progress (Students only)
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leccionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Progress deleted successfully
 *       404:
 *         description: Progress record not found
 */
router.delete('/:leccionId', authenticateToken, requireRole(['estudiante']), deleteProgreso);

export default router;