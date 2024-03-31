const swaggerJSDoc = require('swagger-jsdoc');

// Defining swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for IT5007 project',
    version: '0.1.0',
    description: 'This is the backend API doc for IT5007 MERN app',
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
    },
  },
  // security: [
  //   {
  //     BearerAuth: [],
  //   },
  // ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
