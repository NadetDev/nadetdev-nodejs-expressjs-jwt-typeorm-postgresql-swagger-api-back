import 'reflect-metadata';

import { User, UserRole } from '../entities/User';

import { AppDataSource } from '../config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function createAdminUser() {
  try {
    // Initialiser la connexion à la base de données
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    const userRepository = AppDataSource.getRepository(User);

    // Vérifier si un admin existe déjà
    const existingAdmin = await userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log('⚠️  Un utilisateur administrateur existe déjà');
      console.log(`📧 Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Créer un utilisateur administrateur par défaut
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Vérifier si l'email existe déjà
    const existingUser = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà');
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`👤 Rôle: ${existingUser.role}`);
      process.exit(0);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Créer l'utilisateur admin
    const adminUser = userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(adminUser);

    console.log('🎉 Utilisateur administrateur créé avec succès !');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Mot de passe:', adminPassword);
    console.log('👤 Rôle: ADMIN');
    console.log('');
    console.log(
      '⚠️  IMPORTANT: Changez le mot de passe après la première connexion !'
    );
    console.log('');
    console.log(
      "🚀 Vous pouvez maintenant vous connecter à l'API avec ces identifiants."
    );
    console.log('📖 Documentation API: http://localhost:3000/api-docs');
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de l'utilisateur admin:",
      error
    );
    process.exit(1);
  } finally {
    // Fermer la connexion à la base de données
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Exécuter le script
createAdminUser();
