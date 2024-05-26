const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Chamber of commerce events api',
        description: 'CSE 341 Final team project'
    },
    host: 'chamber-of-commerce-event-manager-cocem.onrender.com',
    schemes: ['https', 'http']
    
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)