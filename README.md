# Notification Service 🚀

## Overview
This project implements a **Notification Service** that supports sending notifications to users via **Email**, **SMS**, and **In-App** notifications. It leverages **RabbitMQ** as a message queue for asynchronous notification processing and **MongoDB** to store user notifications.

---

## Features
- **Send Notification API** (`POST /notifications`): Accepts notification requests via Email, SMS, and In-app.
- **Get User Notifications API** (`GET /users/:id/notifications`): Retrieves all notifications for a specific user.
- Supports **Email** and **SMS** sending via **Nodemailer** and **Twilio**.
- Supports **In-app notifications** stored and fetched from **MongoDB**.
- Uses **RabbitMQ** queue to process notifications asynchronously.
- Implements **retry logic** for failed notification deliveries.

---

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- RabbitMQ (amqplib)
- Nodemailer (Email sending)
- Twilio (SMS sending)
- dotenv (Environment variables)

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or above)
- MongoDB (Atlas or local instance)
- RabbitMQ server running locally or remotely
- Twilio account (for SMS)
- Gmail account or app password (for sending emails)