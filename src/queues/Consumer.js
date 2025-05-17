const amqp = require('amqplib');
require('dotenv').config();

const sendEmail = require('../utils/email');
const sendSMS = require('../utils/sms');

async function startConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('notifications', { durable: true });

    console.log('Consumer connected to RabbitMQ, waiting for messages...');

    channel.consume('notifications', async (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());

        try {
          if (notification.phone) {
            await sendSMS(notification.phone, notification.smsMessage || notification.message);
            console.log(`SMS sent to ${notification.phone}`);
          }

          if (notification.email) {
            await sendEmail(
              notification.email,                
              notification.subject || 'No Subject',
              notification.message
            );
            console.log(`Email sent to ${notification.email}`);
          }

          channel.ack(msg);
        } catch (error) {
          console.error('Failed to send notification:', error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('RabbitMQ connection failed:', error);
  }
}

startConsumer();
