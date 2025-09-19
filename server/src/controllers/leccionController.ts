import { Request, Response } from 'express';
import { Leccion, Modulo, Nivel, Progreso, Usuario } from '../database/database';

interface AuthRequest extends Request {
  user?: any;
}

export const createLeccion = async (req: Request, res: Response) => {
  try {
    const { modulo_id, orden, titulo, contenido_json } = req.body;

    if (!modulo_id || !orden || !titulo) {
      return res.status(400).json({ 
        error: 'modulo_id, orden, and titulo are required' 
      });
    }

    const modulo = await Modulo.findByPk(modulo_id);
    if (!modulo) {
      return res.status(400).json({ error: 'Invalid modulo_id' });
    }

    const existingOrden = await Leccion.findOne({ 
      where: { modulo_id, orden } 
    });
    if (existingOrden) {
      return res.status(400).json({ 
        error: 'Leccion with this orden already exists in this modulo' 
      });
    }

    const leccion = await Leccion.create({
      modulo_id,
      orden,
      titulo,
      contenido_json
    });

    const leccionWithModulo = await Leccion.findByPk(leccion.id, {
      include: [
        { 
          model: Modulo, 
          as: 'Modulo',
          attributes: ['id', 'slug', 'titulo'],
          include: [
            {
              model: Nivel,
              as: 'Nivel',
              attributes: ['id', 'codigo', 'nombre']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Leccion created successfully',
      leccion: leccionWithModulo
    });
  } catch (error) {
    console.error('Create leccion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllLecciones = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, modulo_id, nivel_id } = req.query;
    
    const whereClause: any = {};
    if (modulo_id) {
      whereClause.modulo_id = modulo_id;
    }

    const moduloInclude: any = {
      model: Modulo,
      as: 'Modulo',
      attributes: ['id', 'slug', 'titulo'],
      include: [
        {
          model: Nivel,
          as: 'Nivel',
          attributes: ['id', 'codigo', 'nombre']
        }
      ]
    };

    if (nivel_id) {
      moduloInclude.include = moduloInclude.include || [];
      moduloInclude.include[0] = {
        ...moduloInclude.include[0],
        where: { id: nivel_id }
      };
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const includeArray = [moduloInclude];
    
    const { count, rows: lecciones } = await Leccion.findAndCountAll({
      where: whereClause,
      include: includeArray,
      order: [['modulo_id', 'ASC'], ['orden', 'ASC']],
      limit: Number(limit),
      offset
    });

    res.json({
      lecciones,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get lecciones error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeccionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const includeArray = [
      {
        model: Modulo,
        as: 'Modulo',
        attributes: ['id', 'slug', 'titulo'],
        include: [
          {
            model: Nivel,
            as: 'Nivel',
            attributes: ['id', 'codigo', 'nombre']
          }
        ]
      }
    ];
    
    const leccion = await Leccion.findByPk(id, {
      include: includeArray
    });

    if (!leccion) {
      return res.status(404).json({ error: 'Leccion not found' });
    }

    res.json({ leccion });
  } catch (error) {
    console.error('Get leccion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLeccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, contenido_json, orden } = req.body;

    const leccion = await Leccion.findByPk(id);
    if (!leccion) {
      return res.status(404).json({ error: 'Leccion not found' });
    }

    const updateData: any = {};
    if (titulo) updateData.titulo = titulo;
    if (contenido_json) updateData.contenido_json = contenido_json;
    
    if (orden) {
      const existingOrden = await Leccion.findOne({ 
        where: { 
          modulo_id: leccion.modulo_id, 
          orden, 
          id: { [require('sequelize').Op.ne]: id } 
        } 
      });
      
      if (existingOrden) {
        return res.status(400).json({ 
          error: 'Leccion with this orden already exists in this modulo' 
        });
      }
      
      updateData.orden = orden;
    }

    await leccion.update(updateData);

    const updatedLeccion = await Leccion.findByPk(id, {
      include: [
        {
          model: Modulo,
          as: 'Modulo',
          attributes: ['id', 'slug', 'titulo'],
          include: [
            {
              model: Nivel,
              as: 'Nivel',
              attributes: ['id', 'codigo', 'nombre']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Leccion updated successfully',
      leccion: updatedLeccion
    });
  } catch (error) {
    console.error('Update leccion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLeccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const leccion = await Leccion.findByPk(id);
    if (!leccion) {
      return res.status(404).json({ error: 'Leccion not found' });
    }

    const progresosCount = await Progreso.count({ where: { leccion_id: id } });
    if (progresosCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete leccion with associated progress records' 
      });
    }

    await leccion.destroy();
    res.json({ message: 'Leccion deleted successfully' });
  } catch (error) {
    console.error('Delete leccion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};