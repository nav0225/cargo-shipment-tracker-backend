const express = require('express');
const Shipment = require('../models/shipment');
const ApiError = require('../utils/ApiError');
const { calculateETA } = require('../utils/etaCalculator');
const { 
  validateShipmentCreation, 
  validateLocationUpdate 
} = require('../middlewares/validateRequest');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Shipment:
 *       type: object
 *       required:
 *         - shipmentId
 *         - containerId
 *         - route
 *         - currentLocation
 *         - currentEta
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         shipmentId:
 *           type: string
 *           pattern: '^SHIP-\d{4}$'
 *           example: SHIP-001
 *         containerId:
 *           type: string
 *           pattern: '^CNTR-\d{4}$'
 *           example: CNTR-2024
 *         route:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoutePoint'
 *         currentLocation:
 *           type: string
 *           example: Shanghai
 *         status:
 *           type: string
 *           enum: [In Transit, Delivered, Delayed, At Port]
 *           default: At Port
 *         currentEta:
 *           type: string
 *           format: date-time
 *           example: 2024-03-25T12:00:00Z
 *         averageSpeed:
 *           type: number
 *           minimum: 10
 *           maximum: 100
 *           default: 50
 *     RoutePoint:
 *       type: object
 *       required:
 *         - location
 *         - coordinates
 *       properties:
 *         location:
 *           type: string
 *           example: Singapore
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           example: [103.8198, 1.3521]
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2024-03-20T12:00:00Z
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation error"
 */

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Cargo shipment management API
 */

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Retrieve all shipments
 *     tags: [Shipments]
 *     responses:
 *       200:
 *         description: List of shipments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shipment'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res, next) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipment'
 *     responses:
 *       201:
 *         description: Shipment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.post('/', validateShipmentCreation, async (req, res, next) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/shipments/{id}/update-location:
 *   post:
 *     summary: Update shipment location
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - coordinates
 *             properties:
 *               location:
 *                 type: string
 *                 example: Singapore
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [103.8198, 1.3521]
 *     responses:
 *       200:
 *         description: Location updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipment'
 *       400:
 *         description: Invalid coordinates
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.post('/:id/update-location', validateLocationUpdate, async (req, res, next) => {
  try {
    const { location, coordinates } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      throw new ApiError(404, 'Shipment not found');
    }

    shipment.currentLocation = location;
    shipment.route.push({
      location,
      coordinates,
      timestamp: new Date()
    });

    shipment.currentEta = calculateETA(shipment);
    await shipment.save();

    res.status(200).json({
      success: true,
      data: shipment,
      newETA: shipment.currentEta
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/shipments/{id}/eta:
 *   get:
 *     summary: Get shipment ETA
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shipment ID
 *     responses:
 *       200:
 *         description: ETA details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 eta:
 *                   type: string
 *                   format: date-time
 *                 calculation:
 *                   type: string
 *                   enum: [dynamic, static]
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.get('/:id/eta', async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      throw new ApiError(404, 'Shipment not found');
    }

    const calculatedETA = calculateETA(shipment);
    
    // Safeguard: Only update if currentEta exists and is different, or if currentEta is undefined.
    if (!shipment.currentEta || calculatedETA.getTime() !== shipment.currentEta.getTime()) {
      shipment.currentEta = calculatedETA;
      await shipment.save();
    }

    res.status(200).json({
      success: true,
      eta: shipment.currentEta,
      calculation: 'dynamic'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
