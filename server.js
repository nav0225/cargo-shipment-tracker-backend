require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { errorConverter, errorHandler } = require('./middlewares/errorHandler');
const ApiError = require('./utils/ApiError');

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(bodyParser.json());

// ================== SWAGGER SETUP ==================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================== DATABASE CONNECTION ==================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ================== ROUTES ==================
const shipmentRoutes = require('./routes/shipments');
app.use('/api/shipments', shipmentRoutes);

// ================== ERROR HANDLING ==================
// Handle 404 unknown routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorConverter);

// Final error handler
app.use(errorHandler);

// ================== SERVER SAFETY NETS ==================
// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('- Unhandled Rejection at:', promise, 'Reason:', reason);
  process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('- Uncaught Exception:', err);
  process.exit(1);
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

module.exports = server; // For testing
