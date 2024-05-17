const express = require('express');
const { route } = require('./swagger');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'))
router.use('/', (req, res) => {
    res.status(200).send("Hello World")
})



module.exports = router;