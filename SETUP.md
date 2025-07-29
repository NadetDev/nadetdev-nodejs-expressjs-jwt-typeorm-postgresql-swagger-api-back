# Configuration et Installation

## Prérequis

1. **Node.js** (version 16 ou supérieure)
2. **PostgreSQL** (version 12 ou supérieure)
3. **npm** ou **yarn**

## Installation de PostgreSQL

### Windows

1. Télécharger PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Installer avec les paramètres par défaut
3. Noter le mot de passe du superutilisateur `postgres`

### Configuration de la base de données

1. **Ouvrir pgAdmin ou psql**
2. **Créer la base de données :**

```sql
CREATE DATABASE employee_db;
```

3. **Créer un utilisateur (optionnel) :**

```sql
CREATE USER employee_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE employee_db TO employee_user;
```

## Configuration de l'application

1. **Copier le fichier d'environnement :**

```bash
cp .env.example .env
```

2. **Modifier le fichier .env :**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=employee_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Démarrage de l'application

1. **Installer les dépendances :**

```bash
npm install
```

2. **Compiler le projet :**

```bash
npm run build
```

3. **Démarrer en mode développement :**

```bash
npm run dev
```

4. **Créer un utilisateur administrateur :**

```bash
npx ts-node src/scripts/createAdmin.ts
```

## Test de l'API

Une fois l'application démarrée, vous pouvez tester les endpoints :

### 1. Vérifier que l'API fonctionne

```bash
curl http://localhost:3000/api/health
```

### 2. Créer un utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "staff"
  }'
```

### 3. Se connecter

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Créer un employé (avec le token obtenu)

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

## Résolution des problèmes

### Erreur de connexion à la base de données

- Vérifiez que PostgreSQL est démarré
- Vérifiez les paramètres de connexion dans le fichier `.env`
- Vérifiez que la base de données `employee_db` existe

### Erreur de port déjà utilisé

- Changez le port dans le fichier `.env`
- Ou arrêtez le processus qui utilise le port 3000

### Erreur de compilation TypeScript

- Vérifiez que toutes les dépendances sont installées : `npm install`
- Supprimez le dossier `node_modules` et réinstallez : `rm -rf node_modules && npm install`
