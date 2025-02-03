const Joi = require('joi');

const createShipmentSchema = Joi.object({
  shipmentId: Joi.string().required().pattern(/^SHIP-\d{4}$/),
  containerId: Joi.string().required().pattern(/^CNTR-\d{4}$/),
  route: Joi.array().items(
    Joi.object({
      location: Joi.string().required(),
      coordinates: Joi.array().length(2).items(Joi.number()).required()
    })
  ).min(1).required(),
  currentLocation: Joi.string().required(),
  currentEta: Joi.date().iso().greater('now').required(),
  averageSpeed: Joi.number().min(10).max(100).default(50)
});

const updateLocationSchema = Joi.object({
  location: Joi.string().required(),
  coordinates: Joi.array().length(2).items(Joi.number()).required()
});

module.exports = { createShipmentSchema, updateLocationSchema };