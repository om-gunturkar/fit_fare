import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import API from '../api';

const socket = io('http://localhost:5000');

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchNotifications = async () => {
    const res = await API.get('/notifications');
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
    socket.on('newNotification', (data) => {
      setToast(`${data.type}: ${data.message}`);
      fetchNotifications();
      setTimeout(() => setToast(null), 4000);
    });

    return () => socket.off('newNotification');
  }, []);

  return (
    <div className="card">
      <h2>Notifications</h2>
      {toast && <div className="toast">{toast}</div>}
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <b>{n.type}</b> - {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
