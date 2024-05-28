const dotenv = require("dotenv");
dotenv.config();

const swaggerAutogen = require('swagger-autogen')();

const environment = process.env.ENVIRONMENT || "development";

let schema = ["http"];

if (environment === "production") {
    schema = ["https"];
}

const doc = {
    info: {
        title: 'Chamber of commerce events api',
        description: 'CSE 341 Final team project'
    },
    host: process.env.API_URL,
    schemes: schema

};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);