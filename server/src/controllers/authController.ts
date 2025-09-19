import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../database';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role = 'student', age, level } = req.body;

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await Usuario.create({
      email,
      password,
      firstName,
      lastName,
      role,
      age,
      level,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      'your_super_secret_jwt_key_change_in_production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        age: user.age,
        level: user.level,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      'your_super_secret_jwt_key_change_in_production',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        age: user.age,
        level: user.level,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        age: user.age,
        level: user.level,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};