import { Request, Response } from 'express';
import { Clase, Usuario, ClaseEstudiante } from '../database/database';

interface AuthRequest extends Request {
  user?: any;
}

export const createClase = async (req: AuthRequest, res: Response) => {
  try {
    const { codigo, nombre, grado, seccion, jornada, docente_id } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ error: 'Codigo and nombre are required' });
    }

    const existingClase = await Clase.findOne({ where: { codigo } });
    if (existingClase) {
      return res.status(400).json({ error: 'Clase with this codigo already exists' });
    }

    const finalDocenteId = docente_id || (req.user.rol === 'docente' ? req.user.id : null);
    
    if (!finalDocenteId) {
      return res.status(400).json({ error: 'Docente ID is required' });
    }

    const docente = await Usuario.findOne({ 
      where: { id: finalDocenteId, rol: 'docente' } 
    });
    
    if (!docente) {
      return res.status(400).json({ error: 'Invalid docente ID' });
    }

    const clase = await Clase.create({
      codigo,
      nombre,
      docente_id: finalDocenteId,
      grado,
      seccion,
      jornada
    });

    const claseWithDocente = await Clase.findByPk(clase.id, {
      include: [{ 
        model: Usuario, 
        as: 'Docente',
        attributes: ['id', 'nombre', 'apellido', 'email']
      }]
    });

    res.status(201).json({
      message: 'Clase created successfully',
      clase: claseWithDocente
    });
  } catch (error) {
    console.error('Create clase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllClases = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, docente_id, grado } = req.query;
    
    const whereClause: any = {};
    
    if (req.user.rol === 'docente') {
      whereClause.docente_id = req.user.id;
    } else if (docente_id) {
      whereClause.docente_id = docente_id;
    }
    
    if (grado) {
      whereClause.grado = grado;
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: clases } = await Clase.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Usuario, 
          as: 'Docente',
          attributes: ['id', 'nombre', 'apellido', 'email']
        },
        { 
          model: Usuario, 
          as: 'Estudiantes',
          attributes: ['id', 'nombre', 'apellido', 'email'],
          through: { attributes: ['inscrito_en'] }
        }
      ],
      order: [['creado_en', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      clases,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get clases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const clase = await Clase.findByPk(id, {
      include: [
        { 
          model: Usuario, 
          as: 'Docente',
          attributes: ['id', 'nombre', 'apellido', 'email']
        },
        { 
          model: Usuario, 
          as: 'Estudiantes',
          attributes: ['id', 'nombre', 'apellido', 'email'],
          through: { attributes: ['inscrito_en'] }
        }
      ]
    });

    if (!clase) {
      return res.status(404).json({ error: 'Clase not found' });
    }

    res.json({ clase });
  } catch (error) {
    console.error('Get clase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClase = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, grado, seccion, jornada } = req.body;

    const clase = await Clase.findByPk(id);
    if (!clase) {
      return res.status(404).json({ error: 'Clase not found' });
    }

    if (req.user.rol === 'docente' && clase.docente_id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot update other teacher\'s clase' });
    }

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (grado) updateData.grado = grado;
    if (seccion) updateData.seccion = seccion;
    if (jornada) updateData.jornada = jornada;

    await clase.update(updateData);

    const updatedClase = await Clase.findByPk(id, {
      include: [
        { 
          model: Usuario, 
          as: 'Docente',
          attributes: ['id', 'nombre', 'apellido', 'email']
        }
      ]
    });

    res.json({
      message: 'Clase updated successfully',
      clase: updatedClase
    });
  } catch (error) {
    console.error('Update clase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClase = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const clase = await Clase.findByPk(id);
    if (!clase) {
      return res.status(404).json({ error: 'Clase not found' });
    }

    if (req.user.rol === 'docente' && clase.docente_id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot delete other teacher\'s clase' });
    }

    await clase.destroy();
    res.json({ message: 'Clase deleted successfully' });
  } catch (error) {
    console.error('Delete clase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const enrollStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { estudiante_id } = req.body;

    if (!estudiante_id) {
      return res.status(400).json({ error: 'estudiante_id is required' });
    }

    const clase = await Clase.findByPk(id);
    if (!clase) {
      return res.status(404).json({ error: 'Clase not found' });
    }

    if (req.user.rol === 'docente' && clase.docente_id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot enroll students in other teacher\'s clase' });
    }

    const estudiante = await Usuario.findOne({ 
      where: { id: estudiante_id, rol: 'estudiante' } 
    });
    
    if (!estudiante) {
      return res.status(400).json({ error: 'Invalid estudiante ID' });
    }

    const existingEnrollment = await ClaseEstudiante.findOne({
      where: { estudiante_id }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Student is already enrolled in a clase' });
    }

    await ClaseEstudiante.create({
      clase_id: id,
      estudiante_id
    });

    res.json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unenrollStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id, studentId } = req.params;

    const clase = await Clase.findByPk(id);
    if (!clase) {
      return res.status(404).json({ error: 'Clase not found' });
    }

    if (req.user.rol === 'docente' && clase.docente_id !== req.user.id) {
      return res.status(403).json({ error: 'Cannot unenroll students from other teacher\'s clase' });
    }

    const enrollment = await ClaseEstudiante.findOne({
      where: { clase_id: id, estudiante_id: studentId }
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Student not enrolled in this clase' });
    }

    await enrollment.destroy();
    res.json({ message: 'Student unenrolled successfully' });
  } catch (error) {
    console.error('Unenroll student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};