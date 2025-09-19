import { Request, Response } from 'express';
import { Progreso, Usuario, Leccion, Modulo, Nivel } from '../database/database';

interface AuthRequest extends Request {
  user?: any;
}

export const createOrUpdateProgreso = async (req: AuthRequest, res: Response) => {
  try {
    const { leccion_id, completado, puntaje } = req.body;
    const estudiante_id = req.user.id;

    if (!leccion_id) {
      return res.status(400).json({ error: 'leccion_id is required' });
    }

    const leccion = await Leccion.findByPk(leccion_id);
    if (!leccion) {
      return res.status(400).json({ error: 'Invalid leccion_id' });
    }

    const updateData: any = {
      estudiante_id,
      leccion_id,
      completado: completado || false
    };

    if (puntaje !== undefined) {
      updateData.puntaje = puntaje;
    }

    if (completado) {
      updateData.completado_en = new Date();
    }

    const [progreso, created] = await Progreso.upsert(updateData, {
      returning: true
    });

    const progresoWithDetails = await Progreso.findOne({
      where: { estudiante_id, leccion_id },
      include: [
        {
          model: Leccion,
          as: 'Leccion',
          attributes: ['id', 'titulo', 'orden'],
          include: [
            {
              model: Modulo,
              as: 'Modulo',
              attributes: ['id', 'slug', 'titulo']
            }
          ]
        }
      ]
    });

    res.json({
      message: created ? 'Progress created successfully' : 'Progress updated successfully',
      progreso: progresoWithDetails
    });
  } catch (error) {
    console.error('Create/update progreso error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, modulo_id, nivel_id, completado } = req.query;
    const estudiante_id = req.user.id;

    const whereClause: any = { estudiante_id };
    if (completado !== undefined) {
      whereClause.completado = completado === 'true';
    }

    const leccionInclude: any = {
      model: Leccion,
      as: 'Leccion',
      attributes: ['id', 'titulo', 'orden'],
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
    };

    if (modulo_id) {
      leccionInclude.include[0].where = { id: modulo_id };
    }

    if (nivel_id) {
      leccionInclude.include[0].include[0].where = { id: nivel_id };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: progresos } = await Progreso.findAndCountAll({
      where: whereClause,
      include: [leccionInclude],
      order: [['actualizado_en', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      progresos,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get my progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentProgress = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 10, modulo_id, completado } = req.query;

    const estudiante = await Usuario.findOne({
      where: { id: studentId, rol: 'estudiante' }
    });

    if (!estudiante) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const whereClause: any = { estudiante_id: studentId };
    if (completado !== undefined) {
      whereClause.completado = completado === 'true';
    }

    const leccionInclude: any = {
      model: Leccion,
      as: 'Leccion',
      attributes: ['id', 'titulo', 'orden'],
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
    };

    if (modulo_id) {
      leccionInclude.include[0].where = { id: modulo_id };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: progresos } = await Progreso.findAndCountAll({
      where: whereClause,
      include: [leccionInclude],
      order: [['actualizado_en', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      estudiante: {
        id: estudiante.id,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido
      },
      progresos,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProgressStats = async (req: AuthRequest, res: Response) => {
  try {
    const estudiante_id = req.user.rol === 'estudiante' ? req.user.id : req.params.studentId;

    if (!estudiante_id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const totalLecciones = await Leccion.count();
    const completedLecciones = await Progreso.count({
      where: { estudiante_id, completado: true }
    });
    
    const inProgressLecciones = await Progreso.count({
      where: { estudiante_id, completado: false }
    });

    const avgPuntaje = await Progreso.findOne({
      where: { estudiante_id, puntaje: { [require('sequelize').Op.ne]: null } },
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('puntaje')), 'promedio']
      ]
    });

    const recentProgress = await Progreso.findAll({
      where: { estudiante_id },
      include: [
        {
          model: Leccion,
          as: 'Leccion',
          attributes: ['id', 'titulo'],
          include: [
            {
              model: Modulo,
              as: 'Modulo',
              attributes: ['titulo']
            }
          ]
        }
      ],
      order: [['actualizado_en', 'DESC']],
      limit: 5
    });

    const stats = {
      total_lecciones: totalLecciones,
      completed_lecciones: completedLecciones,
      in_progress_lecciones: inProgressLecciones,
      completion_percentage: totalLecciones > 0 ? (completedLecciones / totalLecciones * 100).toFixed(2) : 0,
      average_score: avgPuntaje?.dataValues?.promedio ? parseFloat(avgPuntaje.dataValues.promedio).toFixed(2) : null,
      recent_activity: recentProgress
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProgreso = async (req: AuthRequest, res: Response) => {
  try {
    const { leccionId } = req.params;
    const estudiante_id = req.user.id;

    const progreso = await Progreso.findOne({
      where: { estudiante_id, leccion_id: leccionId }
    });

    if (!progreso) {
      return res.status(404).json({ error: 'Progress record not found' });
    }

    await progreso.destroy();
    res.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    console.error('Delete progreso error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};