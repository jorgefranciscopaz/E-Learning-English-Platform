import { Request, Response } from 'express';
import { Leccion, Progreso, Modulo } from '../database/database';

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const { modulo_id } = req.query;
    const where: any = {};

    if (modulo_id) where.modulo_id = modulo_id;

    const lessons = await Leccion.findAll({
      where,
      include: [{ 
        model: Modulo, 
        as: 'Modulo',
        attributes: ['id', 'slug', 'titulo']
      }],
      order: [['orden', 'ASC']],
    });

    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await Leccion.findByPk(id, {
      include: [{ 
        model: Modulo, 
        as: 'Modulo',
        attributes: ['id', 'slug', 'titulo']
      }],
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { modulo_id, titulo, orden, contenido_json } = req.body;

    const lesson = await Leccion.create({
      modulo_id,
      titulo,
      orden,
      contenido_json,
    });

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updatedRows] = await Leccion.update(updates, {
      where: { id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lesson = await Leccion.findByPk(id);
    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Leccion.destroy({
      where: { id },
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
