import { Request, Response } from 'express';
import { Modulo, Nivel, Leccion } from '../database/database';

export const createModulo = async (req: Request, res: Response) => {
  try {
    const { nivel_id, slug, titulo, orden } = req.body;

    if (!nivel_id || !slug || !titulo || !orden) {
      return res.status(400).json({ 
        error: 'nivel_id, slug, titulo, and orden are required' 
      });
    }

    const nivel = await Nivel.findByPk(nivel_id);
    if (!nivel) {
      return res.status(400).json({ error: 'Invalid nivel_id' });
    }

    const existingModulo = await Modulo.findOne({ 
      where: { nivel_id, slug } 
    });
    if (existingModulo) {
      return res.status(400).json({ 
        error: 'Modulo with this slug already exists in this nivel' 
      });
    }

    const existingOrden = await Modulo.findOne({ 
      where: { nivel_id, orden } 
    });
    if (existingOrden) {
      return res.status(400).json({ 
        error: 'Modulo with this orden already exists in this nivel' 
      });
    }

    const modulo = await Modulo.create({
      nivel_id,
      slug,
      titulo,
      orden
    });

    const moduloWithNivel = await Modulo.findByPk(modulo.id, {
      include: [
        { 
          model: Nivel, 
          as: 'Nivel',
          attributes: ['id', 'codigo', 'nombre']
        }
      ]
    });

    res.status(201).json({
      message: 'Modulo created successfully',
      modulo: moduloWithNivel
    });
  } catch (error) {
    console.error('Create modulo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllModulos = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, nivel_id } = req.query;
    
    const whereClause: any = {};
    if (nivel_id) {
      whereClause.nivel_id = nivel_id;
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: modulos } = await Modulo.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Nivel, 
          as: 'Nivel',
          attributes: ['id', 'codigo', 'nombre']
        },
        { 
          model: Leccion, 
          as: 'Lecciones',
          attributes: ['id', 'titulo', 'orden']
        }
      ],
      order: [['nivel_id', 'ASC'], ['orden', 'ASC']],
      limit: Number(limit),
      offset
    });

    res.json({
      modulos,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get modulos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getModuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const modulo = await Modulo.findByPk(id, {
      include: [
        { 
          model: Nivel, 
          as: 'Nivel',
          attributes: ['id', 'codigo', 'nombre']
        },
        { 
          model: Leccion, 
          as: 'Lecciones',
          attributes: ['id', 'titulo', 'orden', 'contenido_json'],
          order: [['orden', 'ASC']]
        }
      ]
    });

    if (!modulo) {
      return res.status(404).json({ error: 'Modulo not found' });
    }

    res.json({ modulo });
  } catch (error) {
    console.error('Get modulo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateModulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, orden } = req.body;

    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      return res.status(404).json({ error: 'Modulo not found' });
    }

    const updateData: any = {};
    if (titulo) updateData.titulo = titulo;
    
    if (orden) {
      const existingOrden = await Modulo.findOne({ 
        where: { 
          nivel_id: modulo.nivel_id, 
          orden, 
          id: { [require('sequelize').Op.ne]: id } 
        } 
      });
      
      if (existingOrden) {
        return res.status(400).json({ 
          error: 'Modulo with this orden already exists in this nivel' 
        });
      }
      
      updateData.orden = orden;
    }

    await modulo.update(updateData);

    const updatedModulo = await Modulo.findByPk(id, {
      include: [
        { 
          model: Nivel, 
          as: 'Nivel',
          attributes: ['id', 'codigo', 'nombre']
        }
      ]
    });

    res.json({
      message: 'Modulo updated successfully',
      modulo: updatedModulo
    });
  } catch (error) {
    console.error('Update modulo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteModulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      return res.status(404).json({ error: 'Modulo not found' });
    }

    const leccionesCount = await Leccion.count({ where: { modulo_id: id } });
    if (leccionesCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete modulo with associated lecciones' 
      });
    }

    await modulo.destroy();
    res.json({ message: 'Modulo deleted successfully' });
  } catch (error) {
    console.error('Delete modulo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};