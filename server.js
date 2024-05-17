const express = require('express');
const bodyParser = require('body-parser')
const routes = require('./Routes')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const GitHubStrategy = require('passport-github2').Strategy

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X=Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use('/', routes)




app.listen(port);
console.log(`Connected to DB and listening on ${port}`);
  