import { authenticateToken, requireAdmin } from '../middlewares/auth';

import { EmployeeController } from '../controllers/EmployeeController';
import { Router } from 'express';

const router = Router();
const employeeController = new EmployeeController();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Gestion des employés (CRUD)
 */

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Récupérer la liste des employés
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, absent, quitte]
 *         description: Filtrer par statut
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par prénom, nom ou fonction
 *     responses:
 *       200:
 *         description: Liste des employés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeesResponse'
 *       401:
 *         description: Token invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', employeeController.getAllEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Récupérer un employé par son ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Employé récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       404:
 *         description: Employé non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', employeeController.getEmployeeById);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Créer un nouvel employé
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *           example:
 *             prenom: "Jean"
 *             nom: "Dupont"
 *             fonction: "Développeur"
 *             dateRecrutement: "2024-01-15"
 *             statut: "active"
 *     responses:
 *       201:
 *         description: Employé créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', employeeController.createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Mettre à jour un employé (Admin uniquement)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *           example:
 *             prenom: "Jean"
 *             nom: "Dupont"
 *             fonction: "Senior Développeur"
 *             dateRecrutement: "2024-01-15"
 *             statut: "active"
 *     responses:
 *       200:
 *         description: Employé mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé - Admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Employé non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Routes accessibles uniquement aux administrateurs
router.put('/:id', requireAdmin, employeeController.updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Supprimer un employé (Admin uniquement)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *     responses:
 *       200:
 *         description: Employé supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employé supprimé avec succès"
 *       401:
 *         description: Token invalide ou manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé - Admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Employé non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', requireAdmin, employeeController.deleteEmployee);

export default router;
