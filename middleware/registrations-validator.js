const validator = require('../helpers/validation');

const collection = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    eventId: 'required|string',
    companyName: 'required|string',
    position: 'required|string',
    phone: 'required|string',
    emailAddress: 'required|email',
    numberOfGuests: 'required|string',
    comments: 'required|string'
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