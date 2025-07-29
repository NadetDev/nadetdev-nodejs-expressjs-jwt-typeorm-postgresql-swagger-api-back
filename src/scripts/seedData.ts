import 'reflect-metadata';

import { Employee, EmployeeStatus } from '../entities/Employee';
import { User, UserRole } from '../entities/User';

import { AppDataSource } from '../config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function seedData() {
  try {
    // Initialiser la connexion à la base de données
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    const userRepository = AppDataSource.getRepository(User);
    const employeeRepository = AppDataSource.getRepository(Employee);

    // Créer des utilisateurs de test
    const users = [
      {
        email: 'admin@company.com',
        password: 'admin123',
        role: UserRole.ADMIN,
      },
      {
        email: 'staff1@company.com',
        password: 'staff123',
        role: UserRole.STAFF,
      },
      {
        email: 'staff2@company.com',
        password: 'staff123',
        role: UserRole.STAFF,
      },
    ];

    console.log('👥 Création des utilisateurs...');
    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = userRepository.create({
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
        });
        await userRepository.save(user);
        console.log(
          `✅ Utilisateur créé: ${userData.email} (${userData.role})`
        );
      } else {
        console.log(`⚠️  Utilisateur existe déjà: ${userData.email}`);
      }
    }

    // Créer des employés de test
    const employees = [
      {
        prenom: 'Jean',
        nom: 'Dupont',
        fonction: 'Développeur Full Stack',
        dateRecrutement: new Date('2023-01-15'),
        statut: EmployeeStatus.ACTIVE,
      },
      {
        prenom: 'Marie',
        nom: 'Martin',
        fonction: 'Designer UX/UI',
        dateRecrutement: new Date('2023-03-20'),
        statut: EmployeeStatus.ACTIVE,
      },
      {
        prenom: 'Pierre',
        nom: 'Durand',
        fonction: 'Chef de Projet',
        dateRecrutement: new Date('2022-11-10'),
        statut: EmployeeStatus.ACTIVE,
      },
      {
        prenom: 'Sophie',
        nom: 'Leroy',
        fonction: 'Développeuse Backend',
        dateRecrutement: new Date('2023-05-08'),
        statut: EmployeeStatus.ABSENT,
      },
      {
        prenom: 'Thomas',
        nom: 'Moreau',
        fonction: 'Analyste Business',
        dateRecrutement: new Date('2022-09-12'),
        statut: EmployeeStatus.QUITTE,
      },
      {
        prenom: 'Emma',
        nom: 'Petit',
        fonction: 'DevOps Engineer',
        dateRecrutement: new Date('2023-07-03'),
        statut: EmployeeStatus.ACTIVE,
      },
      {
        prenom: 'Lucas',
        nom: 'Roux',
        fonction: 'Développeur Frontend',
        dateRecrutement: new Date('2023-02-14'),
        statut: EmployeeStatus.ACTIVE,
      },
      {
        prenom: 'Camille',
        nom: 'Fournier',
        fonction: 'Product Owner',
        dateRecrutement: new Date('2022-12-05'),
        statut: EmployeeStatus.ACTIVE,
      },
    ];

    console.log('👨‍💼 Création des employés...');
    for (const employeeData of employees) {
      const existingEmployee = await employeeRepository.findOne({
        where: {
          prenom: employeeData.prenom,
          nom: employeeData.nom,
        },
      });

      if (!existingEmployee) {
        const employee = employeeRepository.create(employeeData);
        await employeeRepository.save(employee);
        console.log(
          `✅ Employé créé: ${employeeData.prenom} ${employeeData.nom} - ${employeeData.fonction}`
        );
      } else {
        console.log(
          `⚠️  Employé existe déjà: ${employeeData.prenom} ${employeeData.nom}`
        );
      }
    }

    console.log('');
    console.log('🎉 Données de test créées avec succès !');
    console.log('');
    console.log('👥 Utilisateurs créés:');
    console.log('  📧 admin@company.com (mot de passe: admin123) - ADMIN');
    console.log('  📧 staff1@company.com (mot de passe: staff123) - STAFF');
    console.log('  📧 staff2@company.com (mot de passe: staff123) - STAFF');
    console.log('');
    console.log(
      `👨‍💼 ${employees.length} employés créés avec différents statuts`
    );
    console.log('');
    console.log("🚀 Vous pouvez maintenant tester l'API !");
    console.log('📖 Documentation: http://localhost:3000/api-docs');
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion à la base de données
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Exécuter le script
seedData();
