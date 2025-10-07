import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';

const BookingHistory = ({ bookings, fetchBookings }) => (
  <div style={{ marginTop: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center' }}>
        <Clock size={20} color="#6366f1" style={{ marginRight: '0.5rem' }} />
        Booking History
      </h3>
      <button 
        onClick={fetchBookings} 
        style={{ color: '#4f46e5', fontSize: '0.875rem', cursor: 'pointer', border: 'none', background: 'none' }}
        title="Refresh History"
      >
        <RefreshCw size={16} />
      </button>
    </div>
    
    <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#eef2ff' }}>
          <tr>
            {['Trainer', 'Date', 'Time', 'Type'].map(header => (
              <th key={header} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '16px 24px', textAlign: 'center', color: '#6b7280' }}>No bookings found.</td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.15s' }}>
                <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{b.trainer}</td>
                <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>
                  {new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280' }}>{b.time}</td>
                <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#4f46e5' }}>{b.type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default BookingHistory;
