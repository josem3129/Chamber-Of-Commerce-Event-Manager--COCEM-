const validator = require('../../helpers/validation');

const collection = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    addressId: 'required|string',
    description: 'required|string',
    date: 'required|string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Data validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  collection
};