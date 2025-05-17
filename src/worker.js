require('dotenv').config();
const mongoose = require('mongoose');
const amqp = require('amqplib');
const Notification = require('./models/Notification');

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Worker connected to MongoDB');
}

async function startWorker() {
  await connectDB();

  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue('notifications', { durable: true });
  channel.prefetch(1);
  console.log('Worker waiting for messages in notifications queue...');

  channel.consume('notifications', async (msg) => {
    if (msg !== null) {
      const notificationData = JSON.parse(msg.content.toString());
      try {
        const notification = new Notification(notificationData);
        await notification.save();
        console.log('Notification saved:', notification);
        channel.ack(msg);
      } catch (err) {
        console.error('Failed to save notification:', err);
        // You can retry or dead-letter here if needed
        channel.nack(msg, false, true);
      }
    }
  });
}

startWorker().catch(console.error);
