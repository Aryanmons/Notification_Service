const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { getChannel } = require('../utils/rabbitmq');

router.post('/', async (req, res) => {
  try {
    const { userId, type, message, phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const notificationData = {
      userId,
      type,
      message,
      phone,                  // include phone here
      status: 'pending',
      createdAt: new Date(),
    };

    const channel = getChannel();
    channel.sendToQueue('notifications', Buffer.from(JSON.stringify(notificationData)), {
      persistent: true,
    });

    res.status(202).json({ message: 'Notification queued for processing' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
