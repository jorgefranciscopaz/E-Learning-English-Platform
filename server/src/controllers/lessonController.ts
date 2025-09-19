import { Request, Response } from 'express';
import { Lesson, Progress, Quiz } from '../database';

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const { level, category } = req.query;
    const where: any = { isActive: true };
    
    if (level) where.level = level;
    if (category) where.category = category;

    const lessons = await Lesson.findAll({
      where,
      include: [{ model: Quiz }],
      order: [['createdAt', 'ASC']],
    });

    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id, {
      include: [{ model: Quiz }],
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
    const { title, description, content, level, category, duration } = req.body;
    
    const lesson = await Lesson.create({
      title,
      description,
      content,
      level,
      category,
      duration,
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

    const [updatedRows] = await Lesson.update(updates, {
      where: { id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lesson = await Lesson.findByPk(id);
    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await Lesson.destroy({
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