import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { isUsingMemoryDb } from '../config/db';
import { memoryStore } from '../config/memoryStore';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'task_manager_secret_key_2026';

      const decoded = jwt.verify(token, secret) as { id: string };

      if (isUsingMemoryDb) {
        const memUser = memoryStore.findUserById(decoded.id);
        if (!memUser) {
          res.status(401).json({ message: 'Not authorized, user not found' });
          return;
        }
        req.user = {
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
        };
      } else {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          res.status(401).json({ message: 'Not authorized, user not found' });
          return;
        }
        req.user = {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
