const express = require('express');
const { route } = require('./swagger');
const passport = require('passport');
const router = express.Router();
const eventsRoute  = require('./eventsRouter');
const addressesRoute  = require('./addressesRouter');
const companiesRoute  = require('./companiesRouter');
const rsvpRoute  = require('./registrationsRouter');


router.use('/', require('./swagger'));
// router.use('/', (req, res) => {
//     res.status(200).send("Hello World")
// })

router.use('/events', eventsRoute);
router.use('/addresses', addressesRoute);
router.use('/companies', companiesRoute);
router.use('/rsvp', rsvpRoute);

router.get('/login', passport.authenticate('github'), (req, res) =>{})

router.get('/logout', function (req, res, next ) {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send('Your logged out');
    });
});


module.exports = router;