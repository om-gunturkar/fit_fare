import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function BookingForm() {
  const [trainer, setTrainer] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Booking Reminder');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('newBooking', { trainer, time, type });
    alert('✅ Booking submitted & notification sent!');
    setTrainer('');
    setTime('');
    setType('Booking Reminder');
  };

  return (
    <div className="card">
      <h2>Book a Slot</h2>
      <form onSubmit={handleSubmit}>
        <label>Trainer Name:</label>
        <input value={trainer} onChange={(e) => setTrainer(e.target.value)} required />

        <label>Time of Booking:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

        <label>Notification Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Booking Reminder</option>
          <option>Gym Update</option>
          <option>Payment Status Update</option>
          <option>Promotion Notification</option>
        </select>

        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
}
