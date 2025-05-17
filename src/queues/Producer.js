const amqp = require('amqplib');
require('dotenv').config();

let channel;

async function connectQueue() {
  if (channel) return channel;
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('notifications', { durable: true });
  return channel;
}

async function sendToQueue(notification) {
  const ch = await connectQueue();
  const payload = Buffer.from(JSON.stringify(notification));
  ch.sendToQueue('notifications', payload);
  console.log('Notification sent to queue:', notification);
}

module.exports = { sendToQueue };
