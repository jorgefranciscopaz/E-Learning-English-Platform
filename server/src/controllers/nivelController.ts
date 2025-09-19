import { Request, Response } from 'express';
import { Nivel, Modulo } from '../database/database';

export const createNivel = async (req: Request, res: Response) => {
  try {
    const { codigo, nombre } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ error: 'Codigo and nombre are required' });
    }

    const existingNivel = await Nivel.findOne({ where: { codigo } });
    if (existingNivel) {
      return res.status(400).json({ error: 'Nivel with this codigo already exists' });
    }

    const nivel = await Nivel.create({ codigo, nombre });

    res.status(201).json({
      message: 'Nivel created successfully',
      nivel
    });
  } catch (error) {
    console.error('Create nivel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllNiveles = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: niveles } = await Nivel.findAndCountAll({
      include: [
        { 
          model: Modulo, 
          as: 'Modulos',
          attributes: ['id', 'slug', 'titulo', 'orden']
        }
      ],
      order: [['codigo', 'ASC']],
      limit: Number(limit),
      offset
    });

    res.json({
      niveles,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get niveles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNivelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const nivel = await Nivel.findByPk(id, {
      include: [
        { 
          model: Modulo, 
          as: 'Modulos',
          attributes: ['id', 'slug', 'titulo', 'orden'],
          order: [['orden', 'ASC']]
        }
      ]
    });

    if (!nivel) {
      return res.status(404).json({ error: 'Nivel not found' });
    }

    res.json({ nivel });
  } catch (error) {
    console.error('Get nivel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNivel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const nivel = await Nivel.findByPk(id);
    if (!nivel) {
      return res.status(404).json({ error: 'Nivel not found' });
    }

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;

    await nivel.update(updateData);

    res.json({
      message: 'Nivel updated successfully',
      nivel
    });
  } catch (error) {
    console.error('Update nivel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteNivel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const nivel = await Nivel.findByPk(id);
    if (!nivel) {
      return res.status(404).json({ error: 'Nivel not found' });
    }

    const modulosCount = await Modulo.count({ where: { nivel_id: id } });
    if (modulosCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete nivel with associated modulos' 
      });
    }

    await nivel.destroy();
    res.json({ message: 'Nivel deleted successfully' });
  } catch (error) {
    console.error('Delete nivel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};