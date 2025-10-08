import React, { useState, useEffect, useCallback } from 'react';
import { API, socket } from '../api';
import BookingHistory from './BookingHistory';
import { CalendarCheck } from 'lucide-react'; 
import './Styles1.css'; 

const BookingForm = () => {
  const [trainer, setTrainer] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Booking Reminder');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nudge, setNudge] = useState(null);

  const fetchBookings = useCallback(async () => {
    setError(null);
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

    socket.on('idle-reminder', (data) => {
        setNudge(data.message); 
        
        setTimeout(() => setNudge(null), 8000); 
    });

    return () => {
        socket.off('updateBookings');
        socket.off('idle-reminder');
    };
  }, [fetchBookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await API.post('/bookings', { trainer, time, date, type });
      socket.emit('newBooking', { trainer, time, date, type });
      fetchBookings();
      setTrainer(''); setTime(''); setDate(''); setType('Booking Reminder');
      alert('Booking added!');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-form-card">
      <h2><CalendarCheck size={24} /> Book Your Gym Slot</h2>

   
      {nudge && (
        <div className="nudge-toast">
          <span role="img" aria-label="alert">⚠️ </span>
          {nudge}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        <input 
          value={trainer} 
          onChange={(e) => setTrainer(e.target.value)} 
          placeholder="Trainer Name" 
          required 
          disabled={isLoading}
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          disabled={isLoading}
        />
        <input 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)} 
          required 
          disabled={isLoading}
        />
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          disabled={isLoading}
        >
          <option>Booking Reminder</option>
          <option>Gym Update</option>
          <option>Payment Status Update</option>
          <option>Promotion Notification</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>

      <BookingHistory bookings={bookings} fetchBookings={fetchBookings} />
    </div>
  );
};

export default BookingForm;