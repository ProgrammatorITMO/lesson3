const swaggerJsDoc = require('swagger-jsdoc');
const docsSwagger = require('./docs');


const options = {
    definition: {
        openapi: '3.0.0', info: {
            title: 'CRUD API Documentation', version: '1.0.0',
        },
    },
    apis: ['./docs.js'],
};

const swaggerSpec = swaggerJsDoc(options);
swaggerSpec.paths = Object.assign({}, docsSwagger.paths);
swaggerSpec.components.schemas = Object.assign({}, docsSwagger.components.schemas);

module.exports = swaggerSpec;