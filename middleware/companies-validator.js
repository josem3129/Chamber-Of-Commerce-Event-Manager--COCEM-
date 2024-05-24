const validator = require('../../helpers/validation');

const collection = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    addressId: 'required|string',
    phone: 'required|string',
    emailAddress: 'required|email',
    membershipLevel: 'required|string',
    joinedOn: 'required|string'
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