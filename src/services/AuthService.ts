import * as jwt from 'jsonwebtoken';

import { AppDataSource } from '../config/database';
import { TokenBlacklist } from '../entities/TokenBlacklist';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private tokenBlacklistRepository =
    AppDataSource.getRepository(TokenBlacklist);

  async register(email: string, password: string, role: string = 'staff') {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role as any,
    });

    await this.userRepository.save(user);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    // Trouver l'utilisateur
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.isActive) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const payload = { userId: user.id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET as string;
    const token = (jwt as any).sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    // Retourner l'utilisateur sans le mot de passe et le token
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async logout(token: string, userId: number) {
    try {
      // Décoder le token pour obtenir la date d'expiration
      const decoded = (jwt as any).decode(token) as any;
      const expiresAt = new Date(decoded.exp * 1000);

      // Ajouter le token à la blacklist
      const blacklistedToken = this.tokenBlacklistRepository.create({
        token,
        userId,
        expiresAt,
      });

      await this.tokenBlacklistRepository.save(blacklistedToken);
      return true;
    } catch (error) {
      throw new Error('Erreur lors de la déconnexion');
    }
  }

  async cleanExpiredTokens() {
    // Nettoyer les tokens expirés de la blacklist
    await this.tokenBlacklistRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
