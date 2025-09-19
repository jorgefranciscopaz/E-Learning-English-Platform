import { Router } from 'express';
import {
  createClase,
  getAllClases,
  getClaseById,
  updateClase,
  deleteClase,
  enrollStudent,
  unenrollStudent
} from '../controllers/claseController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Clase:
 *       type: object
 *       required:
 *         - codigo
 *         - nombre
 *         - docente_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated class ID
 *         codigo:
 *           type: string
 *           description: Unique class code
 *         nombre:
 *           type: string
 *           description: Class name
 *         docente_id:
 *           type: integer
 *           description: Teacher ID
 *         grado:
 *           type: string
 *           description: Grade level
 *         seccion:
 *           type: string
 *           description: Section
 *         jornada:
 *           type: string
 *           description: Schedule (morning/afternoon)
 */

/**
 * @swagger
 * /api/clases:
 *   post:
 *     summary: Create a new class (Admin/Teacher)
 *     tags: [Clases]
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
 *               docente_id:
 *                 type: integer
 *               grado:
 *                 type: string
 *               seccion:
 *                 type: string
 *               jornada:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticateToken, requireRole(['admin', 'docente']), createClase);

/**
 * @swagger
 * /api/clases:
 *   get:
 *     summary: Get all classes
 *     tags: [Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: docente_id
 *         schema:
 *           type: integer
 *         description: Filter by teacher ID
 *       - in: query
 *         name: grado
 *         schema:
 *           type: string
 *         description: Filter by grade
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
 *         description: List of classes
 */
router.get('/', authenticateToken, getAllClases);

/**
 * @swagger
 * /api/clases/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Clases]
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
 *         description: Class found
 *       404:
 *         description: Class not found
 */
router.get('/:id', authenticateToken, getClaseById);

/**
 * @swagger
 * /api/clases/{id}:
 *   put:
 *     summary: Update class (Admin/Own Teacher)
 *     tags: [Clases]
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
 *               grado:
 *                 type: string
 *               seccion:
 *                 type: string
 *               jornada:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Class not found
 */
router.put('/:id', authenticateToken, requireRole(['admin', 'docente']), updateClase);

/**
 * @swagger
 * /api/clases/{id}:
 *   delete:
 *     summary: Delete class (Admin/Own Teacher)
 *     tags: [Clases]
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
 *         description: Class deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Class not found
 */
router.delete('/:id', authenticateToken, requireRole(['admin', 'docente']), deleteClase);

/**
 * @swagger
 * /api/clases/{id}/enroll:
 *   post:
 *     summary: Enroll student in class (Admin/Teacher)
 *     tags: [Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante_id
 *             properties:
 *               estudiante_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Student enrolled successfully
 *       400:
 *         description: Invalid input or student already enrolled
 *       403:
 *         description: Forbidden
 */
router.post('/:id/enroll', authenticateToken, requireRole(['admin', 'docente']), enrollStudent);

/**
 * @swagger
 * /api/clases/{id}/unenroll/{studentId}:
 *   delete:
 *     summary: Unenroll student from class (Admin/Teacher)
 *     tags: [Clases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student unenrolled successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not enrolled in this class
 */
router.delete('/:id/unenroll/:studentId', authenticateToken, requireRole(['admin', 'docente']), unenrollStudent);

export default router;