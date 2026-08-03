import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { isUsingMemoryDb } from '../config/db';
import { memoryStore } from '../config/memoryStore';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'task_manager_secret_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    if (isUsingMemoryDb) {
      const existing = memoryStore.findUserByEmail(email);
      if (existing) {
        res.status(400).json({ message: 'User already exists with this email' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = memoryStore.createUser(name, email, hashedPassword);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
      return;
    }

    // MongoDB Mongoose flow
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Register Error:', error);
    res.status(500).json({ message: error.message || 'Server Error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    if (isUsingMemoryDb) {
      const user = memoryStore.findUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
        return;
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
    }

    // MongoDB Mongoose flow
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password!))) {
      res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Server Error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
