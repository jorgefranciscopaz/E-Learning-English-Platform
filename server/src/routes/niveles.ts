import { Router } from 'express';
import {
  createNivel,
  getAllNiveles,
  getNivelById,
  updateNivel,
  deleteNivel
} from '../controllers/nivelController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Nivel:
 *       type: object
 *       required:
 *         - codigo
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *         codigo:
 *           type: string
 *           description: Level code (e.g., 1A, 1B)
 *         nombre:
 *           type: string
 *           description: Level name
 */

/**
 * @swagger
 * /api/niveles:
 *   post:
 *     summary: Create a new level (Admin only)
 *     tags: [Niveles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Level created successfully
 */
router.post('/', authenticateToken, requireRole(['admin']), createNivel);

/**
 * @swagger
 * /api/niveles:
 *   get:
 *     summary: Get all levels
 *     tags: [Niveles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of levels with their modules
 */
router.get('/', authenticateToken, getAllNiveles);

/**
 * @swagger
 * /api/niveles/{id}:
 *   get:
 *     summary: Get level by ID
 *     tags: [Niveles]
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
 *         description: Level found with modules
 *       404:
 *         description: Level not found
 */
router.get('/:id', authenticateToken, getNivelById);

/**
 * @swagger
 * /api/niveles/{id}:
 *   put:
 *     summary: Update level (Admin only)
 *     tags: [Niveles]
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
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Level updated successfully
 */
router.put('/:id', authenticateToken, requireRole(['admin']), updateNivel);

/**
 * @swagger
 * /api/niveles/{id}:
 *   delete:
 *     summary: Delete level (Admin only)
 *     tags: [Niveles]
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
 *         description: Level deleted successfully
 *       400:
 *         description: Cannot delete level with associated modules
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteNivel);

export default router;