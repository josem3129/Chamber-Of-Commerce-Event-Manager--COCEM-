const express = require('express');
const bodyParser = require('body-parser')
const routes = require('./Routes')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const mongodb = require('./Models/Database')
const GitHubStrategy = require('passport-github2').Strategy

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X=Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use(cors({methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
  .use(cors({origin: '*'}))
  .use('/', routes)

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function (accessToken, refreshToken, profile, done) {
  //User.indOrCreate({githubId: profile.id}, function(err, user) {
    return done(null, profile)
  // });
}))
  
passport.serializeUser((user, done) => {
  done(null, user)
});
passport.deserializeUser((user, done) => {
  done(null, user)
});

app.get('/', (req, res) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}`: "please login")
});
app.get('/github/callback', passport.authenticate('github',{
  failureRedirect: '/api-docs', session: false}),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  })
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception ${err}\n` + `exception origin: ${origin}`);
})    



mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

module.exports = app