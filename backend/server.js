import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes.js';
import db from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const server = http.createServer(app);

// ⚡ Setup Socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('newBooking', async (data) => {
    const { trainer, time, type } = data;
    const message = `Booking with ${trainer} at ${time}`;
    await db.execute('INSERT INTO bookings (trainer, time, type) VALUES (?, ?, ?)', [trainer, time, type]);
    await db.execute('INSERT INTO notifications (type, message) VALUES (?, ?)', [type, message]);
    io.emit('newNotification', { type, message });
  });

  socket.on('newReview', async (data) => {
    const { user, rating, comment } = data;
    await db.execute('INSERT INTO reviews (user, rating, comment) VALUES (?, ?, ?)', [user, rating, comment]);
    io.emit('updateReviews');
  });
});

server.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);
