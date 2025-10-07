import express from 'express';
import { connectDB } from './db.js';

const router = express.Router();

// Helper for error responses
const handleError = (res, error, message) => {
  console.error(`❌ ${message}:`, error.message);
  res.status(500).json({ message, detail: error.message });
};

/* ---------------------------- BOOKINGS ---------------------------- */

// 📖 Get All Bookings
router.get('/bookings', async (_, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM bookings ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching bookings');
  }
});

// 🧾 Create New Booking + Notification
router.post('/bookings', async (req, res) => {
  const { trainer, time, type, date } = req.body;
  if (!trainer || !time || !type || !date)
    return res.status(400).json({ error: 'All fields are required' });

  const message = `Booking with ${trainer} on ${date} at ${time}`;
  try {
    const db = await connectDB();
    await db.execute('INSERT INTO bookings (trainer, time, type, date) VALUES (?, ?, ?, ?)', [trainer, time, type, date]);
    await db.execute('INSERT INTO notifications (type, message) VALUES (?, ?)', [type, message]);
    res.json({ success: true, message: 'Booking created and notification added' });
  } catch (error) {
    handleError(res, error, 'Error creating booking');
  }
});

/* -------------------------- NOTIFICATIONS -------------------------- */

// 📖 Get All Notifications
router.get('/notifications', async (_, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM notifications ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching notifications');
  }
});

/* ----------------------------- REVIEWS ----------------------------- */

// 🧾 Add Review
router.post('/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!user || !rating || !comment)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const db = await connectDB();
    await db.execute('INSERT INTO reviews (user, rating, comment) VALUES (?, ?, ?)', [user, rating, comment]);
    res.json({ success: true, message: 'Review added' });
  } catch (error) {
    handleError(res, error, 'Error adding review');
  }
});

// 📖 Fetch All Reviews
router.get('/reviews', async (_, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM reviews ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching reviews');
  }
});

export default router;
