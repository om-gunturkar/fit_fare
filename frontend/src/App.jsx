import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BookingForm from './components/BookingForm';
import NotificationPanel from './components/NotificationPanel';
import FeedbackPanel from './components/FeedbackPanel';
import './App.css';

const App = () => {
  const [page, setPage] = useState('booking');

  const renderPage = () => {
    switch (page) {
      case 'notifications': return <NotificationPanel />;
      case 'feedback': return <FeedbackPanel />;
      default: return <BookingForm />;
    }
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: '#f7f7f9' }}>
      <Navbar page={page} setPage={setPage} />
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
