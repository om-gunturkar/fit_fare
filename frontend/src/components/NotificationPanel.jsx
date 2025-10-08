import React, { useEffect, useState, useCallback } from 'react';
import { API, socket } from '../api';
import { Bell } from 'lucide-react';
import './Styles1.css';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    socket.on('newNotification', (data) => {
      setToast(`${data.type}: ${data.message}`);
      fetchNotifications(); 
      setTimeout(() => setToast(null), 4000);
    });

   
    socket.on('idle-reminder', (data) => {
    
      setToast(`🔔 ${data.type}: ${data.message}`);
    
      setTimeout(() => setToast(null), 8000);
    });

   
    socket.on('sessionReminder', (data) => {
     
      setToast(`🚨 ${data.type}: ${data.message}`);
     
      setTimeout(() => setToast(null), 10000);
    });

    
    return () => {
      socket.off('newNotification');
      socket.off('idle-reminder');
      socket.off('sessionReminder');
    };
  }, [fetchNotifications]);

  return (
    <div className="notification-card">
      <div className="notification-header">
        <Bell className="bell-icon" />
        <h2>Notifications</h2>
      </div>

  
      {toast && <div className="toast">{toast}</div>}

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="notification-item">
              <div className="notification-type">{n.type}</div>
              <div className="notification-message">{n.message}</div>
              <div className="notification-time">
                {new Date(n.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
