const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const connectDB = require('./config/db');
const userRouter = require('./routes/user_routes');

const app = express();

// CORS configuration supporting local dev and production frontend
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (e.g. mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.clientUrl
      ? config.clientUrl.split(',').map((o) => o.trim())
      : ['*'];

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/users', userRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.status || err.statusCode || 500;
  const message =
    config.isProduction && statusCode === 500
      ? 'Internal Server Error'
      : err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Start Server after establishing database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message || error);
    process.exit(1);
  }
};

startServer();

module.exports = app;