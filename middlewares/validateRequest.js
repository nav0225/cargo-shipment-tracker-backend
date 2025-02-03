const { ApiError } = require('../utils/ApiError');
const { createShipmentSchema, updateLocationSchema } = require('../validators/shipmentValidator');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    next(new ApiError(400, errorMessages.join('. ')));
  }
  next();
};

module.exports = {
  validateShipmentCreation: validate(createShipmentSchema),
  validateLocationUpdate: validate(updateLocationSchema)
};