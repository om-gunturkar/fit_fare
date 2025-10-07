import React, { useState, useEffect, useCallback } from 'react';
import { API, socket } from '../api';
import BookingHistory from './BookingHistory';
import { CalendarCheck, Calendar, Clock, User, Hash } from 'lucide-react';

const BookingForm = () => {
  const [trainer, setTrainer] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Booking Reminder');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch {
      setError('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    socket.on('updateBookings', fetchBookings);
    return () => socket.off('updateBookings');
  }, [fetchBookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', { trainer, time, date, type });
      socket.emit('newBooking', { trainer, time, date, type });
      fetchBookings();
      setTrainer(''); setTime(''); setDate(''); setType('Booking Reminder');
      alert('Booking added!');
    } catch {
      setError('Failed to create booking');
    }
  };

  return (
    <div className="card">
      <h2><CalendarCheck /> Book Your Gym Slot</h2>
      <form onSubmit={handleSubmit}>
        <input value={trainer} onChange={(e) => setTrainer(e.target.value)} placeholder="Trainer Name" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Booking Reminder</option>
          <option>Gym Update</option>
          <option>Payment Status Update</option>
          <option>Promotion Notification</option>
        </select>
        <button type="submit">{isLoading ? 'Submitting...' : 'Submit'}</button>
      </form>

      <BookingHistory bookings={bookings} fetchBookings={fetchBookings} />
    </div>
  );
};

export default BookingForm;
