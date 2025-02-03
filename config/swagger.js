const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cargo Tracker API',
      version: '1.0.0',
      description: 'API Documentation for Cargo Shipment Tracking System',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' }
    ],
    components: {
      schemas: {
        Shipment: {
          type: 'object',
          properties: {
            shipmentId: { type: 'string', example: 'SHIP-001' },
            containerId: { type: 'string', example: 'CNTR-2024' },
            currentLocation: { type: 'string', example: 'Shanghai' },
            currentEta: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-03-25T12:00:00Z'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Points to annotated route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
