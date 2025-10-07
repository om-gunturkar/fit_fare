import React from 'react';
import { CalendarCheck, Bell, MessageSquare } from 'lucide-react';

const Navbar = ({ page, setPage }) => {
  const navItemStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: active ? '#4f46e5' : 'transparent',
    color: active ? 'white' : '#1e3a8a',
    cursor: 'pointer',
  });

  return (
    <nav style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '1rem', background: 'white', position: 'fixed', top: 0, width: '100%', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <div onClick={() => setPage('booking')} style={navItemStyle(page === 'booking')}><CalendarCheck /> Book Slot</div>
      <div onClick={() => setPage('notifications')} style={navItemStyle(page === 'notifications')}><Bell /> Notifications</div>
      <div onClick={() => setPage('feedback')} style={navItemStyle(page === 'feedback')}><MessageSquare /> Feedback</div>
    </nav>
  );
};

export default Navbar;
