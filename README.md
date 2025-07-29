# API RESTful de Gestion des Employés

Une API RESTful complète pour la gestion des employés avec authentification JWT, développée avec Express.js, TypeORM, PostgreSQL et TypeScript.

## Fonctionnalités

- ✅ Authentification JWT avec expiration (24h)
- ✅ Gestion des rôles (Admin, Staff)
- ✅ CRUD complet des employés
- ✅ Blacklist des tokens pour la déconnexion sécurisée
- ✅ Validation des données
- ✅ Sécurité renforcée (Helmet, CORS, Rate Limiting)
- ✅ Recherche et filtrage des employés

## Technologies Utilisées

- **Backend**: Node.js, Express.js, TypeScript
- **Base de données**: PostgreSQL avec TypeORM
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Sécurité**: Helmet, CORS, bcryptjs, express-rate-limit

## Installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd employee-api
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configuration de l'environnement**

```bash
cp .env.example .env
```

Modifier le fichier `.env` avec vos paramètres :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=employee_db

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```

4. **Créer la base de données PostgreSQL**

```sql
CREATE DATABASE employee_db;
```

5. **Démarrer l'application**

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

6. **Créer un utilisateur administrateur**

```bash
npx ts-node src/scripts/createAdmin.ts
```

## Structure du Projet

```
src/
├── config/
│   └── database.ts          # Configuration TypeORM
├── controllers/
│   ├── AuthController.ts    # Contrôleur d'authentification
│   └── EmployeeController.ts # Contrôleur des employés
├── entities/
│   ├── User.ts              # Entité utilisateur
│   ├── Employee.ts          # Entité employé
│   └── TokenBlacklist.ts    # Entité blacklist des tokens
├── middlewares/
│   └── auth.ts              # Middlewares d'authentification
├── routes/
│   ├── auth.ts              # Routes d'authentification
│   ├── employees.ts         # Routes des employés
│   └── index.ts             # Routes principales
├── services/
│   ├── AuthService.ts       # Service d'authentification
│   └── EmployeeService.ts   # Service des employés
├── scripts/
│   └── createAdmin.ts       # Script de création d'admin
└── index.ts                 # Point d'entrée de l'application
```

## API Endpoints

### Authentification

| Méthode | Endpoint             | Description        | Accès       |
| ------- | -------------------- | ------------------ | ----------- |
| POST    | `/api/auth/register` | Inscription        | Public      |
| POST    | `/api/auth/login`    | Connexion          | Public      |
| POST    | `/api/auth/logout`   | Déconnexion        | Authentifié |
| GET     | `/api/auth/profile`  | Profil utilisateur | Authentifié |

### Employés

| Méthode | Endpoint             | Description          | Accès            |
| ------- | -------------------- | -------------------- | ---------------- |
| GET     | `/api/employees`     | Liste des employés   | Authentifié      |
| GET     | `/api/employees/:id` | Détails d'un employé | Authentifié      |
| POST    | `/api/employees`     | Créer un employé     | Authentifié      |
| PUT     | `/api/employees/:id` | Modifier un employé  | Admin uniquement |
| DELETE  | `/api/employees/:id` | Supprimer un employé | Admin uniquement |

### Paramètres de requête pour GET /api/employees

- `status`: Filtrer par statut (active, absent, quitte)
- `search`: Rechercher par prénom, nom ou fonction

## Exemples d'utilisation

### 1. Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "staff"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Créer un employé

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prenom": "Jean",
    "nom": "Dupont",
    "fonction": "Développeur",
    "dateRecrutement": "2024-01-15",
    "statut": "active"
  }'
```

### 4. Lister les employés

```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Rechercher des employés

```bash
curl -X GET "http://localhost:3000/api/employees?search=Jean" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Filtrer par statut

```bash
curl -X GET "http://localhost:3000/api/employees?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Modèles de Données

### Utilisateur

```typescript
{
  id: number;
  email: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Employé

```typescript
{
  id: number;
  prenom: string;
  nom: string;
  fonction: string;
  dateRecrutement: Date;
  statut: 'active' | 'absent' | 'quitte';
  createdAt: Date;
  updatedAt: Date;
}
```

## Sécurité

- **Authentification JWT** : Tokens avec expiration de 24h
- **Blacklist des tokens** : Les tokens sont invalidés lors de la déconnexion
- **Hashage des mots de passe** : bcryptjs avec salt de 12 rounds
- **Rate limiting** : 100 requêtes par IP toutes les 15 minutes
- **Validation des données** : class-validator pour la validation des entrées
- **Headers de sécurité** : Helmet.js pour les headers HTTP sécurisés

## Gestion des Erreurs

L'API retourne des codes de statut HTTP appropriés :

- `200` : Succès
- `201` : Créé avec succès
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## Scripts Disponibles

- `npm run dev` : Démarrer en mode développement
- `npm run build` : Compiler le TypeScript
- `npm start` : Démarrer en mode production
- `npx ts-node src/scripts/createAdmin.ts` : Créer un utilisateur admin

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence ISC.
