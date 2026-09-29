require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || '*',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',
};

module.exports = config;
