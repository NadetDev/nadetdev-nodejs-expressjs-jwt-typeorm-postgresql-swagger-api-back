import { Router } from 'express';
import authRoutes from './auth';
import employeeRoutes from './employees';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des employés
router.use('/employees', employeeRoutes);

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Vérification de l'état de l'API
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Vérifier l'état de l'API
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API fonctionnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API Employee - Service en ligne"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
// Route de santé
router.get('/health', (req, res) => {
  res.json({
    message: 'API Employee - Service en ligne',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
