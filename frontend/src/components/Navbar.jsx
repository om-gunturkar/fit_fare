import React from 'react';
import { CalendarCheck, Bell, MessageSquare } from 'lucide-react';
import './Styles1.css';

const Navbar = ({ page, setPage }) => {
  const getNavItemClassName = (itemName) => {
    const isActive = page === itemName;
    
    return `nav-item ${isActive ? 'nav-item-active' : ''}`;
  };

  return (
    <nav className="navbar">
      <div 
        onClick={() => setPage('booking')} 
        className={getNavItemClassName('booking')}
      >
        <CalendarCheck size={20} /> Book Slot
      </div>
      <div 
        onClick={() => setPage('notifications')} 
        className={getNavItemClassName('notifications')}
      >
        <Bell size={20} /> Notifications
      </div>
      <div 
        onClick={() => setPage('feedback')} 
        className={getNavItemClassName('feedback')}
      >
        <MessageSquare size={20} /> Feedback
      </div>
    </nav>
  );
};

export default Navbar;