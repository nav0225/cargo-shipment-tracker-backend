const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },
  containerId: {
    type: String,
    required: true
  },
  route: [{
    location: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true // Enforce coordinates for ETA calculation
    }
  }],
  currentLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['In Transit', 'Delivered', 'Delayed', 'At Port'],
    default: 'At Port'
  },
  currentEta: {
    type: Date,
    required: true
  },
  
  averageSpeed: {
    type: Number,
    default: 50 // km/h
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

shipmentSchema.index({ 'route.coordinates': '2dsphere' });

module.exports = mongoose.model('Shipment', shipmentSchema);