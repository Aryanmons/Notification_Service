const { sendToQueue } = require('./src/queues/Producer');

async function test() {
  await sendToQueue({
    email: 'aryan1707br@gmail.com',        // Put recipient email here
    subject: 'Test Email from RabbitMQ',
    message: 'Hello! This is a test email sent from your notification system.',
    phone: process.env.MY_PHONE_NUMBER,        // From your .env phone number
    smsMessage: 'Hello! This is a test SMS from your notification system.',
  });
}

test();
