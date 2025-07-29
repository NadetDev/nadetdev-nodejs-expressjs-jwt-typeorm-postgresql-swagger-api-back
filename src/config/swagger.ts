import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Management API',
      version: '1.0.0',
      description:
        'API RESTful pour la gestion des employés avec authentification JWT',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT dans le format: Bearer {token}',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: "ID unique de l'utilisateur",
            },
            email: {
              type: 'string',
              format: 'email',
              description: "Adresse email de l'utilisateur",
            },
            role: {
              type: 'string',
              enum: ['admin', 'staff'],
              description: "Rôle de l'utilisateur",
            },
            isActive: {
              type: 'boolean',
              description: "Statut actif de l'utilisateur",
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
            },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: "ID unique de l'employé",
            },
            prenom: {
              type: 'string',
              description: "Prénom de l'employé",
            },
            nom: {
              type: 'string',
              description: "Nom de l'employé",
            },
            fonction: {
              type: 'string',
              description: "Fonction/poste de l'employé",
            },
            dateRecrutement: {
              type: 'string',
              format: 'date',
              description: 'Date de recrutement',
            },
            statut: {
              type: 'string',
              enum: ['active', 'absent', 'quitte'],
              description: "Statut de l'employé",
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière mise à jour',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Mot de passe (minimum 6 caractères)',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Mot de passe (minimum 6 caractères)',
            },
            role: {
              type: 'string',
              enum: ['admin', 'staff'],
              default: 'staff',
              description: "Rôle de l'utilisateur",
            },
          },
        },
        CreateEmployeeRequest: {
          type: 'object',
          required: ['prenom', 'nom', 'fonction', 'dateRecrutement'],
          properties: {
            prenom: {
              type: 'string',
              description: "Prénom de l'employé",
            },
            nom: {
              type: 'string',
              description: "Nom de l'employé",
            },
            fonction: {
              type: 'string',
              description: "Fonction/poste de l'employé",
            },
            dateRecrutement: {
              type: 'string',
              format: 'date',
              description: 'Date de recrutement (YYYY-MM-DD)',
            },
            statut: {
              type: 'string',
              enum: ['active', 'absent', 'quitte'],
              default: 'active',
              description: "Statut de l'employé",
            },
          },
        },
        UpdateEmployeeRequest: {
          type: 'object',
          properties: {
            prenom: {
              type: 'string',
              description: "Prénom de l'employé",
            },
            nom: {
              type: 'string',
              description: "Nom de l'employé",
            },
            fonction: {
              type: 'string',
              description: "Fonction/poste de l'employé",
            },
            dateRecrutement: {
              type: 'string',
              format: 'date',
              description: 'Date de recrutement (YYYY-MM-DD)',
            },
            statut: {
              type: 'string',
              enum: ['active', 'absent', 'quitte'],
              description: "Statut de l'employé",
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message de réponse',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'Token JWT',
            },
          },
        },
        EmployeeResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message de réponse',
            },
            employee: {
              $ref: '#/components/schemas/Employee',
            },
          },
        },
        EmployeesResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message de réponse',
            },
            employees: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Employee',
              },
            },
            count: {
              type: 'integer',
              description: "Nombre d'employés",
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: "Message d'erreur",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Chemins vers les fichiers contenant les annotations
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
