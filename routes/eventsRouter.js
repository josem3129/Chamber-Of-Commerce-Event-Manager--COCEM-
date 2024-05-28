const express = require('express');

const controller = require('../controllers/eventsController');
const validator = require('../middleware/events-validator');
const {isAuthenticated} = require('../middleware/authenticate');


const router = express.Router();


router.get('/', controller.getData);
router.get('/:id', controller.getDataById);
router.post('/', isAuthenticated, validator.collection, controller.createData);
router.put('/:id', isAuthenticated, validator.collection, controller.updateData);
router.delete('/:id', isAuthenticated, controller.deleteData);

module.exports = router;