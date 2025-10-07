import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import API from '../api';

const socket = io('http://localhost:5000');

export default function ReviewPanel() {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    const res = await API.get('/reviews');
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
    socket.on('updateReviews', fetchReviews);
    return () => socket.off('updateReviews');
  }, []);

  const sendReview = (e) => {
    e.preventDefault();
    socket.emit('newReview', { user, rating, comment });
    setUser('');
    setRating('');
    setComment('');
  };

  return (
    <div className="card">
      <h2>Submit Review</h2>
      <form onSubmit={sendReview}>
        <input placeholder="Name" value={user} onChange={(e) => setUser(e.target.value)} required />
        <input placeholder="Rating (1–5)" type="number" value={rating} onChange={(e) => setRating(e.target.value)} required />
        <input placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>

      <h3>All Reviews</h3>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>⭐ {r.rating}/5 — {r.comment} ({r.user})</li>
        ))}
      </ul>
    </div>
  );
}
