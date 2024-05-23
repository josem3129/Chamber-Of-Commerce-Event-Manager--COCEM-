const express = require('express');

const controller = require('../Controllers/eventsController');
const validator = require('../middleware/events-validator');

const router = express.Router();


router.get('/', controller.getData);
router.get('/:id', controller.getDataById);
router.post('/', validator.saveData, controller.createData);
router.put('/:id', validator.saveData, controller.updateData);
router.delete('/:id', controller.deleteData);

module.exports = router;