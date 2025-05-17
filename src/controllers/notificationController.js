const Notification = require('../models/Notification');
const { sendToQueue } = require('../queues/Producer');

const sendNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields: userId, type, message' });
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }
    if (!process.env.RABBITMQ_URL) {
      throw new Error('RABBITMQ_URL not defined in environment variables');
    }

    const notification = new Notification({ userId, type, message });
    await notification.save();

    await sendToQueue(notification);

    res.status(201).json({ message: 'Notification queued successfully' });
  } catch (err) {
    console.error('Error in sendNotification:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id });
    res.json(notifications);
  } catch (err) {
    console.error('Error in getUserNotifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { sendNotification, getUserNotifications };
