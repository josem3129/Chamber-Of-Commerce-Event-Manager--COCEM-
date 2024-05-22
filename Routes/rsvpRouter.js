const express = require('express');

const controller = require('../controllers/rsvpController');
const validator = require('../middleware/rsvp-validator');

const router = express.Router();


router.get('/', controller.getData);
router.get('/:id', controller.getDataById);
router.post('/', validator.saveData, controller.createData);
router.put('/:id', validator.saveData, controller.updateData);
router.delete('/:id', controller.deleteData);

module.exports = router;