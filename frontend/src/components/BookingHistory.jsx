import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import './Styles1.css'; 

const BookingHistory = ({ bookings, fetchBookings }) => (
  <div className="history-container">
    <div className="header-row">
      <h3 className="header-title">
        <Clock size={20} color="#6366f1" className="header-icon" />
        Booking History
      </h3>
      <button 
        onClick={fetchBookings} 
        className="refresh-button"
        title="Refresh History"
      >
        <RefreshCw size={16} />
      </button>
    </div>
    
    <div className="table-wrapper">
      <table className="booking-table">
        <thead className="table-header">
          <tr>
            {['Trainer', 'Date', 'Time', 'Type'].map(header => (
              <th key={header} className="table-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-bookings-cell">No bookings found.</td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id}>
                <td className={`table-cell cell-trainer`}>{b.trainer}</td>
                <td className={`table-cell cell-date`}>
                  {new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className={`table-cell cell-time`}>{b.time}</td>
                <td className={`table-cell cell-type`}>{b.type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default BookingHistory;