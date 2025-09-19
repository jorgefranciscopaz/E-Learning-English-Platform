import { Router } from 'express';
import {
  createModulo,
  getAllModulos,
  getModuloById,
  updateModulo,
  deleteModulo
} from '../controllers/moduloController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Modulo:
 *       type: object
 *       required:
 *         - nivel_id
 *         - slug
 *         - titulo
 *         - orden
 *       properties:
 *         id:
 *           type: integer
 *         nivel_id:
 *           type: integer
 *           description: Level ID
 *         slug:
 *           type: string
 *           description: Module slug (e.g., abecedario, numeros)
 *         titulo:
 *           type: string
 *           description: Module title
 *         orden:
 *           type: integer
 *           description: Order within the level
 */

/**
 * @swagger
 * /api/modulos:
 *   post:
 *     summary: Create a new module (Admin/Teacher)
 *     tags: [Modulos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nivel_id
 *               - slug
 *               - titulo
 *               - orden
 *             properties:
 *               nivel_id:
 *                 type: integer
 *               slug:
 *                 type: string
 *               titulo:
 *                 type: string
 *               orden:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Module created successfully
 */
router.post('/', authenticateToken, requireRole(['admin', 'docente']), createModulo);

/**
 * @swagger
 * /api/modulos:
 *   get:
 *     summary: Get all modules
 *     tags: [Modulos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of modules with lessons
 */
router.get('/', authenticateToken, getAllModulos);

/**
 * @swagger
 * /api/modulos/{id}:
 *   get:
 *     summary: Get module by ID
 *     tags: [Modulos]
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
 *         description: Module found with lessons
 *       404:
 *         description: Module not found
 */
router.get('/:id', authenticateToken, getModuloById);

/**
 * @swagger
 * /api/modulos/{id}:
 *   put:
 *     summary: Update module (Admin/Teacher)
 *     tags: [Modulos]
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
 *               orden:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Module updated successfully
 */
router.put('/:id', authenticateToken, requireRole(['admin', 'docente']), updateModulo);

/**
 * @swagger
 * /api/modulos/{id}:
 *   delete:
 *     summary: Delete module (Admin only)
 *     tags: [Modulos]
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
 *         description: Module deleted successfully
 *       400:
 *         description: Cannot delete module with associated lessons
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteModulo);

export default router;