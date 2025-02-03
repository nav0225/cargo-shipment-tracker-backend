# Cargo Shipment Tracker Backend

Welcome to the backend repository for the Cargo Shipment Tracker application. This project is built using Node.js, Express, and MongoDB and provides a robust API for managing and tracking cargo shipments.

---

## Table of Contents

- [Features](#features)
- [Architecture & Project Structure](#architecture--project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

---

## Features

- **CRUD API Endpoints:**  
  - Retrieve all shipments
  - Create a new shipment
  - Update shipment location
  - Get shipment ETA (Estimated Time of Arrival)

- **Dynamic ETA Calculation:**  
  Utilizes a custom algorithm (Haversine formula) to calculate ETA based on shipment data.

- **Swagger API Documentation:**  
  Interactive documentation is available at `/api-docs`.

- **Centralized Error Handling:**  
  Custom error handling middleware for consistent error responses.

- **Request Validation:**  
  Ensures incoming data meets required criteria using middleware.

---

## Architecture & Project Structure

```
cargo-shipment-tracker-backend/
├── config/
│   └── swagger.js          # Swagger configuration for API docs
├── middlewares/
│   └── errorHandler.js     # Error handling middleware
├── models/
│   └── shipment.js         # Mongoose model for shipments
├── routes/
│   └── shipments.js        # API routes for shipment operations (with Swagger annotations)
├── utils/
│   ├── etaCalculator.js    # Utility for dynamic ETA calculation
│   └── ApiError.js         # Custom error class for API errors
├── .env                    # Environment variables (excluded from repo)
├── package.json            # Project configuration and dependencies
└── server.js               # Main server entry point
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later)
- [MongoDB](https://www.mongodb.com/) (either a local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git (for version control)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nav0225/cargo-shipment-tracker-backend.git
   cd cargo-shipment-tracker-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the project root and configure the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/cargo-tracker
PORT=5000
NODE_ENV=development
```

---

## Running the Application

### Development Mode

Use nodemon for hot-reloading during development:

```bash
npm run dev
```

### Production Mode

Start the server in production mode:

```bash
npm start
```

---

## API Documentation

Interactive API documentation is provided using Swagger. After starting the server, visit:

[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

This interface allows you to view, test, and understand all API endpoints, including their request/response formats and schema definitions.

---

## Testing

- **Manual Testing:**  
  Use tools like [Postman](https://www.postman.com/) or `curl` commands to test the API endpoints.

- **Automated Testing:**  
  (If applicable, mention any test scripts or frameworks used, e.g., Jest)

- **Error Handling & Validation:**  
  The API includes centralized error handling and request validation to ensure robust interactions.

---

## Future Enhancements

- Dockerize the application for containerized deployment.
- Implement additional endpoints and business logic as needed.
- Integrate advanced authentication and authorization mechanisms.
- Improve logging and monitoring for production readiness.

---

## Acknowledgements

- Built with Node.js, Express, and MongoDB.
- API documentation provided by Swagger.
- Contributions and feedback are welcome!
```