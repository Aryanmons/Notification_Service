require('dotenv').config();
const express = require('express');
const connectDB = require('../config/db');  // your MongoDB connection file
const notificationRoutes = require('./routes/NotificationRoutes'); // your notifications API routes
const { connectRabbitMQ } = require('./utils/rabbitmq');

async function startServer() {
  try {
    await connectRabbitMQ();
    console.log('Mongo URI:', process.env.MONGODB_URI);

    await connectDB();

    const app = express();
    app.use(express.json());

    app.use('/api/notifications', notificationRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
