import React from 'react';
import BookingForm from './components/BookingForm.jsx';
import NotificationPanel from './components/NotificationPanel.jsx';
import ReviewPanel from './components/ReviewPanel.jsx';

export default function App() {
  return (
    <div className="container">
      <h1>📢 Notifications & Feedback</h1>
      <div className="grid">
        <BookingForm />
        <NotificationPanel />
        <ReviewPanel />
      </div>
    </div>
  );
}
