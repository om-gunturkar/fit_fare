import express from 'express';
import { connectDB } from './db.js';

const router = express.Router();

const handleError = (res, error, message) => {
  console.error(`❌ ${message}:`, error.message);
  res.status(500).json({ message, detail: error.message });
};


router.get('/bookings', async (_, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM bookings ORDER BY id DESC');
    if (!rows.length) return res.status(204).send();
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching bookings');
  }
});


router.post('/bookings', async (req, res) => {
  const { trainer, time, type, date } = req.body;
  if (!trainer || !time || !type || !date)
    return res.status(400).json({ error: 'All fields are required' });

  const message = `Booking with ${trainer} on ${date} at ${time}`;

  try {
    const db = await connectDB();


    await db.execute(
      'INSERT INTO bookings (trainer, time, type, date) VALUES (?, ?, ?, ?)',
      [trainer, time, type, date]
    );


    await db.execute(
      'INSERT INTO notifications (type, message) VALUES (?, ?)',
      [type, message]
    );

    console.log(`✅ Booking created with trainer ${trainer} on ${date} at ${time}`);
    res.json({ success: true, message: 'Booking created and notification added' });
  } catch (error) {
    handleError(res, error, 'Error creating booking');
  }
});


router.get('/notifications', async (_, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM notifications ORDER BY id DESC');
    if (!rows.length) return res.status(204).send();
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching notifications');
  }
});


router.post('/reviews', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!user || !rating || !comment)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const db = await connectDB();
    await db.execute(
      'INSERT INTO reviews (user, rating, comment) VALUES (?, ?, ?)',
      [user, rating, comment]
    );

    console.log(`📝 New review added by ${user}`);
    res.json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    handleError(res, error, 'Error adding review');
  }
});

router.get('/reviews', async (_, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM reviews ORDER BY id DESC');
    if (!rows.length) return res.status(204).send();
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching reviews');
  }
});

export default router;
