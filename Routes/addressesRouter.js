const express = require('express');

const controller = require('../Controllers/addressesController');
const validator = require('../middleware/address-validator');
const {isAuthenticated} = require('../middleware/authenticate');

const router = express.Router();


router.get('/', controller.getData);
router.get('/:id', controller.getDataById);
router.post('/', isAuthenticated, validator.collection, controller.createData);
router.put('/:id', isAuthenticated, validator.collection, controller.updateData);
router.delete('/:id', isAuthenticated, controller.deleteData);

module.exports = router;