import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Learning English Platform API',
      version: '1.0.0',
      description: 'API for E-Learning English platform designed for kids. Includes authentication, curriculum management, and progress tracking.',
      contact: {
        name: 'API Support',
        email: 'support@elearning.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://api.elearning.com' : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Access token required'
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Insufficient permissions'
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Resource not found'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Invalid input data'
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Usuarios',
        description: 'User management and authentication'
      },
      {
        name: 'Clases',
        description: 'Class management and student enrollment'
      },
      {
        name: 'Niveles',
        description: 'Educational level management'
      },
      {
        name: 'Modulos',
        description: 'Curriculum module management'
      },
      {
        name: 'Lecciones',
        description: 'Lesson content management'
      },
      {
        name: 'Progresos',
        description: 'Student progress tracking'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };