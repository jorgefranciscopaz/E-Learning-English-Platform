import { Router } from 'express';
import {
  createLeccion,
  getAllLecciones,
  getLeccionById,
  updateLeccion,
  deleteLeccion
} from '../controllers/leccionController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Leccion:
 *       type: object
 *       required:
 *         - modulo_id
 *         - orden
 *         - titulo
 *       properties:
 *         id:
 *           type: integer
 *         modulo_id:
 *           type: integer
 *           description: Module ID
 *         orden:
 *           type: integer
 *           description: Order within the module
 *         titulo:
 *           type: string
 *           description: Lesson title
 *         contenido_json:
 *           type: object
 *           description: Lesson content in JSON format
 */

/**
 * @swagger
 * /api/lecciones:
 *   post:
 *     summary: Create a new lesson (Admin/Teacher)
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modulo_id
 *               - orden
 *               - titulo
 *             properties:
 *               modulo_id:
 *                 type: integer
 *               orden:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               contenido_json:
 *                 type: object
 *     responses:
 *       201:
 *         description: Lesson created successfully
 */
router.post('/', authenticateToken, requireRole(['admin', 'docente']), createLeccion);

/**
 * @swagger
 * /api/lecciones:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lecciones]
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
 *         description: List of lessons (includes student progress if student)
 */
router.get('/', authenticateToken, getAllLecciones);

/**
 * @swagger
 * /api/lecciones/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson found (includes student progress if student)
 *       404:
 *         description: Lesson not found
 */
router.get('/:id', authenticateToken, getLeccionById);

/**
 * @swagger
 * /api/lecciones/{id}:
 *   put:
 *     summary: Update lesson (Admin/Teacher)
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido_json:
 *                 type: object
 *               orden:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 */
router.put('/:id', authenticateToken, requireRole(['admin', 'docente']), updateLeccion);

/**
 * @swagger
 * /api/lecciones/{id}:
 *   delete:
 *     summary: Delete lesson (Admin only)
 *     tags: [Lecciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       400:
 *         description: Cannot delete lesson with associated progress
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteLeccion);

export default router;