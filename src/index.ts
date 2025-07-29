import 'reflect-metadata';

import { specs, swaggerUi } from './config/swagger';

import { AppDataSource } from './config/database';
import { AuthService } from './services/AuthService';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
});
app.use(limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Employee Management API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// Route de redirection vers la documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Routes
app.use('/api', routes);

// Middleware de gestion d'erreurs
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Fonction pour nettoyer les tokens expirés périodiquement
const cleanupExpiredTokens = () => {
  const authService = new AuthService();
  setInterval(async () => {
    try {
      await authService.cleanExpiredTokens();
      console.log('Nettoyage des tokens expirés effectué');
    } catch (error) {
      console.error('Erreur lors du nettoyage des tokens:', error);
    }
  }, 60 * 60 * 1000); // Nettoyer toutes les heures
};

// Initialisation de la base de données et démarrage du serveur
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Connexion à la base de données établie');

    // Démarrer le nettoyage périodique des tokens
    cleanupExpiredTokens();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error(
      '❌ Erreur lors de la connexion à la base de données:',
      error
    );
    process.exit(1);
  });
