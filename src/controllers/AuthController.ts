import { Request, Response } from 'express';

import { AuthRequest } from '../middlewares/auth';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email et mot de passe requis' });
      }

      const user = await this.authService.register(email, password, role);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email et mot de passe requis' });
      }

      const result = await this.authService.login(email, password);

      res.json({
        message: 'Connexion réussie',
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };

  logout = async (req: AuthRequest, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token || !req.user) {
        return res.status(400).json({ message: 'Token requis' });
      }

      await this.authService.logout(token, req.user.id);

      res.json({ message: 'Déconnexion réussie' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  profile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }

      const { password, ...userWithoutPassword } = req.user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
