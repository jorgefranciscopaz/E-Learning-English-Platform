import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Usuario, Clase, ClaseEstudiante } from '../database/database';

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { usuario, email, password, rol, nombre, apellido } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario and password are required' });
    }

    const existingUser = await Usuario.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ usuario }, { email }] 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Usuario or email already exists' });
    }

    const newUser = await Usuario.create({
      usuario,
      email,
      password_hash: password,
      rol: rol || 'estudiante',
      nombre,
      apellido
    });

    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        rol: newUser.rol 
      },
      'your_super_secret_jwt_key_change_in_production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        usuario: newUser.usuario,
        email: newUser.email,
        rol: newUser.rol,
        nombre: newUser.nombre,
        apellido: newUser.apellido
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario and password are required' });
    }

    const user = await Usuario.findOne({ where: { usuario } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        rol: user.rol 
      },
      'your_super_secret_jwt_key_change_in_production',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        rol: user.rol,
        nombre: user.nombre,
        apellido: user.apellido
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    let userWithClases = null;
    
    if (user.rol === 'docente') {
      userWithClases = await Usuario.findByPk(user.id, {
        include: [{ 
          model: Clase, 
          as: 'ClasesImpartidas',
          attributes: ['id', 'codigo', 'nombre', 'grado', 'seccion', 'jornada']
        }]
      });
    } else if (user.rol === 'estudiante') {
      userWithClases = await Usuario.findByPk(user.id, {
        include: [{ 
          model: Clase, 
          as: 'ClasesInscritas',
          attributes: ['id', 'codigo', 'nombre', 'grado', 'seccion', 'jornada']
        }]
      });
    } else {
      userWithClases = user;
    }

    res.json({
      user: {
        id: userWithClases.id,
        usuario: userWithClases.usuario,
        email: userWithClases.email,
        rol: userWithClases.rol,
        nombre: userWithClases.nombre,
        apellido: userWithClases.apellido,
        clases: userWithClases.ClasesImpartidas || userWithClases.ClasesInscritas || []
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { rol, page = 1, limit = 10 } = req.query;
    
    const whereClause: any = {};
    if (rol) {
      whereClause.rol = rol;
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    const { count, rows: users } = await Usuario.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'usuario', 'email', 'rol', 'nombre', 'apellido', 'creado_en'],
      order: [['creado_en', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      users,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await Usuario.findByPk(id, {
      attributes: ['id', 'usuario', 'email', 'rol', 'nombre', 'apellido', 'creado_en'],
      include: [
        { 
          model: Clase, 
          as: 'ClasesImpartidas',
          attributes: ['id', 'codigo', 'nombre']
        },
        { 
          model: Clase, 
          as: 'ClasesInscritas',
          attributes: ['id', 'codigo', 'nombre']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol } = req.body;

    if (req.user.rol !== 'admin' && req.user.id !== Number(id)) {
      return res.status(403).json({ error: 'Cannot update other users' });
    }

    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (apellido) updateData.apellido = apellido;
    if (email) updateData.email = email;
    
    if (rol && req.user.rol === 'admin') {
      updateData.rol = rol;
    }

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email,
        rol: user.rol,
        nombre: user.nombre,
        apellido: user.apellido
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};