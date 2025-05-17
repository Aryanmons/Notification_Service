const express = require('express');
const router = express.Router();
const amqp = require('amqplib');

router.post('/', async (req, res) => {
  try {
    const { message, phone } = req.body;

    if (!message || !phone) {
      return res.status(400).json({ error: 'Message and phone number are required' });
    }

    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'notifications';

    await channel.assertQueue(queue, { durable: true });

    // Send message to queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ message, phone, status: 'pending', createdAt: new Date() })));

    await channel.close();
    await connection.close();

    res.json({ message: 'Notification queued for processing' });
  } catch (err) {
    console.error('Error in POST /notifications:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
