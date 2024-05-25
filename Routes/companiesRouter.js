const express = require('express');

const controller = require('../Controllers/companiesController');
const validator = require('../middleware/companies-validator');

const router = express.Router();


router.get('/', controller.getData);
router.get('/:id', controller.getDataById);
router.post('/', validator.collection, controller.createData);
router.put('/:id', validator.collection, controller.updateData);
router.delete('/:id', controller.deleteData);

module.exports = router;