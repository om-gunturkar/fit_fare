import React, { useState, useEffect, useCallback } from 'react';
import { API, socket } from '../api';
import { MessageSquare, Star } from 'lucide-react';
import './Styles1.css'; 

const FeedbackPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await API.get('/reviews');
      const data = res.data;
      setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, []);

  useEffect(() => {
    fetchReviews();

    socket.on('updateReviews', fetchReviews);

    return () => socket.off('updateReviews', fetchReviews);
  }, [fetchReviews]);

  const sendReview = async (e) => {
    e.preventDefault();

    if (!user || !rating || !comment || parseInt(rating) < 1 || parseInt(rating) > 5) {
      alert("Please fill out all fields with a rating between 1 and 5.");
      return;
    }

    try {
      const newReview = {
        user,
        rating: parseInt(rating),
        comment,
        created_at: new Date().toISOString()
      };

      await API.post('/reviews', newReview);

      setReviews(prev => [newReview, ...prev]);

      socket.emit('newReview', newReview);

      setUser('');
      setRating('');
      setComment('');

    } catch (error) {
      console.error("Failed to post review:", error);
      alert("There was an error submitting your review.");
    }
  };

  return (
    <div className="feedback-panel-card">
      <h2><MessageSquare size={24} /> Feedback</h2>

      <form onSubmit={sendReview} className="feedback-form">
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Your name"
          required
        />
        <input
          type="number"
          value={rating}
          min="1"
          max="5"
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (1-5)"
          required
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your comments..."
          required
        />
        <button type="submit">Submit Feedback</button>
      </form>

      <div className="review-list-container">
        {(Array.isArray(reviews) ? reviews : []).map((r, index) => (
          <div key={r.id || `${r.user}-${r.created_at}-${index}`} className="review-item">
            <strong>{r.user}</strong>
            <span className="review-rating">
              <Star
                size={16}
                fill="#f59e0b"
                color="#f59e0b"
                style={{ marginRight: '4px' }}
              />
              {r.rating}/5
            </span>
            <p>{r.comment}</p>
            <small>{new Date(r.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPanel;
