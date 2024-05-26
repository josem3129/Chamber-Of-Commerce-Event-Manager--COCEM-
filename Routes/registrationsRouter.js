const express = require('express');

const controller = require('../Controllers/registrationsController');
const validator = require('../middleware/registrations-validator');
const {isAuthenticated} = require('../middleware/authenticate');


const router = express.Router();


router.get('/', controller.getData);
router.get('/:id', controller.getDataById);
router.post('/', isAuthenticated, validator.collection, controller.createData);
router.put('/:id', isAuthenticated, validator.collection, controller.updateData);
router.delete('/:id', isAuthenticated, controller.deleteData);

module.exports = router;