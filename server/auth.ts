import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { adminUserValidation } from '@shared/mongodb-schemas';

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthRequest extends Request {
  adminUser?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Generate JWT token
export function generateToken(adminUser: { id: string; username: string; email: string; role: string }): string {
  return jwt.sign(
    { 
      id: adminUser.id, 
      username: adminUser.username, 
      email: adminUser.email, 
      role: adminUser.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Middleware to authenticate admin requests
export async function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    // Get admin user from database to verify they still exist and are active
    const adminUser = await storage.getAdminUser(decoded.id);
    if (!adminUser) {
      return res.status(401).json({ error: 'Access denied. Admin user not found.' });
    }

    // Attach admin user info to request
    req.adminUser = {
      id: (adminUser._id as any).toString(),
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Access denied. Invalid token.' });
  }
}

// Middleware to check if admin has super_admin role
export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.adminUser) {
    return res.status(401).json({ error: 'Access denied. Authentication required.' });
  }

  if (req.adminUser.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied. Super admin privileges required.' });
  }

  next();
}

// Login function
export async function loginAdmin(username: string, password: string) {
  try {
    // Find admin user by username or email
    let adminUser = await storage.getAdminUserByUsername(username);
    if (!adminUser) {
      adminUser = await storage.getAdminUserByEmail(username);
    }

    if (!adminUser) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken({
      id: (adminUser._id as any).toString(),
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    });

    return {
      token,
      user: {
        id: (adminUser._id as any).toString(),
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    };
  } catch (error) {
    throw error;
  }
}

// Register first admin user (for initial setup)
export async function registerFirstAdmin(userData: { username: string; email: string; password: string }) {
  try {
    // Check if any admin users already exist
    const existingUsers = await storage.getAllAdminUsers();
    if (existingUsers && existingUsers.length > 0) {
      throw new Error('Admin users already exist. Registration not allowed.');
    }

    // Validate input data
    const validatedData = adminUserValidation.parse({
      ...userData,
      role: 'super_admin' // First user gets super admin privileges
    });

    // Create the admin user
    const adminUser = await storage.createAdminUser(validatedData);

    // Generate token
    const token = generateToken({
      id: (adminUser._id as any).toString(),
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    });

    return {
      token,
      user: {
        id: (adminUser._id as any).toString(),
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    };
  } catch (error) {
    throw error;
  }
}