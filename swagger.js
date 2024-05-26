const swaggerAutogen = require('swagger-autogen')();
const port = process.env.PORT || "localhost:8080";

const doc = {
    info: {
        title: 'Chamber of commerce events api',
        description: 'CSE 341 Final team project'
    },
    host: port,
    schemes: ['https', 'http']
    
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)