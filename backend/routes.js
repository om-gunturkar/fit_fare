import express from 'express';
import db from './db.js';

const router = express.Router();

// 🧾 Get All Notifications
router.get('/notifications', async (_, res) => {
  const [rows] = await db.execute('SELECT * FROM notifications ORDER BY id DESC');
  res.json(rows);
});

// 📩 Post Booking Notification
router.post('/bookings', async (req, res) => {
  const { trainer, time, type } = req.body;
  const message = `Booking with ${trainer} at ${time}`;
  await db.execute('INSERT INTO bookings (trainer, time, type) VALUES (?, ?, ?)', [trainer, time, type]);
  await db.execute('INSERT INTO notifications (type, message) VALUES (?, ?)', [type, message]);
  res.json({ success: true });
});

// 🌟 Add Review
router.post('/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  await db.execute('INSERT INTO reviews (user, rating, comment) VALUES (?, ?, ?)', [user, rating, comment]);
  res.json({ success: true });
});

// 📖 Fetch Reviews
router.get('/reviews', async (_, res) => {
  const [rows] = await db.execute('SELECT * FROM reviews ORDER BY id DESC');
  res.json(rows);
});

export default router;
