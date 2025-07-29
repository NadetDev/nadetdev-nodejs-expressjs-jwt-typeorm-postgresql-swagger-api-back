import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { User, UserRole } from '../entities/User';

import { AppDataSource } from '../config/database';
import { TokenBlacklist } from '../entities/TokenBlacklist';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token d'accès requis" });
  }

  try {
    // Vérifier si le token est dans la blacklist
    const tokenBlacklistRepo = AppDataSource.getRepository(TokenBlacklist);
    const blacklistedToken = await tokenBlacklistRepo.findOne({
      where: { token },
    });

    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Vérifier la validité du token
    const decoded = (jwt as any).verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    // Récupérer l'utilisateur
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: decoded.userId } });

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: 'Utilisateur non trouvé ou inactif' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res
      .status(403)
      .json({ message: 'Accès refusé. Droits administrateur requis.' });
  }

  next();
};
