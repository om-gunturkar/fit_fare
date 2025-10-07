import React, { useState, useEffect, useCallback } from 'react';
import { API, socket } from '../api';
import { MessageSquare, Star } from 'lucide-react';

const FeedbackPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchReviews = useCallback(async () => {
    const res = await API.get('/reviews');
    setReviews(res.data);
  }, []);

  useEffect(() => {
    fetchReviews();
    socket.on('updateReviews', fetchReviews);
    return () => socket.off('updateReviews');
  }, [fetchReviews]);

  const sendReview = async (e) => {
    e.preventDefault();
    await API.post('/reviews', { user, rating: parseInt(rating), comment });
    socket.emit('newReview', { user, rating, comment });
    setUser(''); setRating(''); setComment('');
    fetchReviews();
  };

  return (
    <div className="card">
      <h2><MessageSquare /> Feedback</h2>
      <form onSubmit={sendReview}>
        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Your name" required />
        <input type="number" value={rating} min="1" max="5" onChange={(e) => setRating(e.target.value)} required />
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" required />
        <button type="submit">Submit</button>
      </form>

      {reviews.map((r) => (
        <div key={r.id} className="review">
          <strong>{r.user}</strong> <Star /> {r.rating}/5
          <p>{r.comment}</p>
          <small>{new Date(r.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default FeedbackPanel;
