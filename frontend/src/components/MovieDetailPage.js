// MovieDetailPage.js - Complete with Reviews
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import API_URL from '../config';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  padding: var(--spacing-2xl) var(--spacing-xl);
  color: var(--galaxy-text-primary);
  font-family: var(--font-primary);
  animation: ${fadeIn} 0.6s ease-out;
  width: 100%;
`;

const MovieHeader = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  border-radius: var(--border-radius-large);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  transition: transform 0.3s ease;
  border: 2px solid rgba(102, 126, 234, 0.2);
  
  &:hover {
    transform: scale(1.03);
  }
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const MovieTitle = styled.h1`
  font-family: var(--font-primary);
  font-size: 2.75rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  letter-spacing: -0.022em;
`;

const MovieYear = styled.span`
  color: var(--galaxy-text-secondary);
  font-size: 1.25rem;
  font-weight: 400;
`;

const MovieStats = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
  flex-wrap: wrap;
  margin: var(--spacing-lg) 0;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--galaxy-text-secondary);
  font-size: 0.95rem;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius);
  
  .icon {
    font-size: 1.1rem;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius-full);
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(102, 126, 234, 0.3)'};
  background: ${props => props.active ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'white' : 'var(--galaxy-text-primary)'};
  cursor: pointer;
  font-family: var(--font-primary);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-gradient);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.filled ? '#FFD700' : 'rgba(102, 126, 234, 0.3)'};
  transition: all 0.2s ease;
  padding: 2px;
  
  &:hover {
    color: #FFD700;
    transform: scale(1.1);
  }
`;

const ReviewSection = styled.div`
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-3xl);
  border-top: 2px solid rgba(102, 126, 234, 0.2);
`;

const ReviewForm = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: var(--spacing-lg);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.05);
  color: var(--galaxy-text-primary);
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.6);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: var(--galaxy-text-secondary);
  }
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
`;

const CharacterCount = styled.span`
  font-size: 0.875rem;
  color: var(--galaxy-text-secondary);
`;

const PostButton = styled.button`
  padding: var(--spacing-md) var(--spacing-2xl);
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-full);
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-left: 4px solid var(--accent-gradient);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateX(4px);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: var(--galaxy-text-primary);
  font-size: 1.05rem;
`;

const ReviewDate = styled.div`
  font-size: 0.875rem;
  color: var(--galaxy-text-secondary);
`;

const ReviewRating = styled.div`
  color: #FFD700;
  margin-bottom: var(--spacing-sm);
  font-size: 1.1rem;
`;

const ReviewText = styled.p`
  line-height: 1.68;
  color: var(--galaxy-text-secondary);
  margin: 0;
  font-size: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 1.75rem;
  margin-bottom: var(--spacing-xl);
  color: var(--galaxy-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  
  &::before {
    content: '';
    width: 4px;
    height: 28px;
    background: var(--accent-gradient);
    border-radius: 2px;
  }
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-xl);
`;

const CastCard = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const CastPhoto = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md) auto;
  font-size: 1.75rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
`;

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // User interaction states
  const [loved, setLoved] = useState(false);
  const [watched, setWatched] = useState(false);
  const [wantToWatch, setWantToWatch] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Review states
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    average_rating: 0,
    total_reviews: 0,
    watched_count: 0,
    want_to_watch_count: 0,
    love_count: 0
  });

  useEffect(() => {
    fetchMovie();
    fetchMovieStats();
    fetchReviews();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/movies/details/${id}/`);
      const data = await response.json();
      
      if (data.Response !== 'False') {
        setMovie(data);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Token ${token}` } : {};
      
      const response = await fetch(`${API_URL}/api/movies/stats/${id}/`, { headers });
      const data = await response.json();
      
      setStats(data);
      
      // Update user interactions if logged in
      if (data.user_interactions) {
        setWatched(data.user_interactions.watched || false);
        setWantToWatch(data.user_interactions.want_to_watch || false);
        setLoved(data.user_interactions.love || false);
        setHasReviewed(data.user_interactions.has_reviewed || false);
        setUserRating(data.user_interactions.user_rating || 0);
        setReviewText(data.user_interactions.user_review_text || '');
      }
    } catch (error) {
      console.error('Error fetching movie stats:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/movies/reviews/movie/${id}/`);
      const data = await response.json();
      
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);



  const handlePostReview = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to leave a review');
      return;
    }
    
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      alert('Review must be at least 10 characters');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/movies/reviews/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          imdb_id: id,
          title: movie.Title,
          rating: userRating,
          review_text: reviewText
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        setHasReviewed(true);
        setWatched(true); // Auto-marked as watched by backend
        fetchReviews();
        fetchMovieStats();
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error posting review:', error);
      alert('Failed to post review');
    }
  };

  const toggleWatchState = async (state) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to use this feature');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/movies/watch-state/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          imdb_id: id,
          state: state,
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster,
          genre: movie.Genre
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (state === 'watched') {
          setWatched(data.action === 'added');
          if (data.action === 'added') setWantToWatch(false);
        } else {
          setWantToWatch(data.action === 'added');
          if (data.action === 'added') setWatched(false);
        }
        fetchMovieStats();
      }
    } catch (error) {
      console.error('Error toggling watch state:', error);
    }
  };

  const toggleLove = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to use this feature');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/movies/toggle-like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          imdb_id: id,
          type: 'love'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLoved(data.action === 'added');
        fetchMovieStats();
      }
    } catch (error) {
      console.error('Error toggling love:', error);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }

  if (!movie) {
    return <Container><div>Movie not found</div></Container>;
  }

  return (
    <Container>
      <MovieHeader>
        <MoviePoster
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.png'}
          alt={movie.Title}
        />
        
        <MovieInfo>
          <div>
            <MovieTitle>{movie.Title}</MovieTitle>
            <MovieYear>{movie.Year}</MovieYear>
          </div>
          
          <MovieStats>
            <Stat><span className="icon">★</span><span>{movie.imdbRating}/10 IMDb</span></Stat>
            <Stat><span className="icon">★</span><span>{stats.average_rating > 0 ? `${stats.average_rating.toFixed(1)}/5` : 'No ratings'} User Rating</span></Stat>
            <Stat><span className="icon">♥</span><span>{stats.love_count} loves</span></Stat>
            <Stat><span className="icon">✎</span><span>{stats.total_reviews} reviews</span></Stat>
            <Stat><span className="icon">●</span><span>{stats.watched_count} watched</span></Stat>
            <Stat><span className="icon">◷</span><span>{movie.Runtime}</span></Stat>
          </MovieStats>

          <UserActions>
            <ActionButton active={loved} onClick={toggleLove}>
              {loved ? '♥ Loved' : '♡ Love'}
            </ActionButton>
            <ActionButton active={watched} onClick={() => toggleWatchState('watched')}>
              {watched ? '✓ Watched' : 'Mark as Watched'}
            </ActionButton>
            <ActionButton active={wantToWatch} onClick={() => toggleWatchState('want_to_watch')}>
              {wantToWatch ? '✓ Watchlist' : 'Add to Watchlist'}
            </ActionButton>
          </UserActions>

          <div>
            <h3 style={{ color: 'var(--galaxy-text-primary)', marginBottom: 'var(--spacing-md)' }}>Plot</h3>
            <p style={{ color: 'var(--galaxy-text-secondary)', lineHeight: '1.68' }}>{movie.Plot}</p>
          </div>
        </MovieInfo>
      </MovieHeader>

      {/* REVIEW SECTION */}
      <ReviewSection>
        <SectionTitle>Reviews ({stats.total_reviews})</SectionTitle>
        
        {/* Write Review Form - Only show if logged in and watched */}
        {isAuthenticated && watched && (
          <ReviewForm>
            <h3 style={{ marginTop: 0, marginBottom: 'var(--spacing-lg)', color: 'var(--galaxy-text-primary)' }}>
              {hasReviewed ? 'Update Your Review' : 'Write a Review'}
            </h3>
            
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--galaxy-text-primary)' }}>Your Rating:</h4>
              <StarRating>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    filled={star <= (hoverRating || userRating)}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </StarButton>
                ))}
                <span style={{ marginLeft: 'var(--spacing-md)', color: 'var(--galaxy-text-secondary)' }}>
                  {userRating > 0 ? `${userRating}/5 stars` : 'Click to rate'}
                </span>
              </StarRating>
            </div>
            
            <ReviewTextarea
              placeholder="Share your thoughts about this movie... What did you like? What didn't work for you?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={1000}
            />
            <ReviewActions>
              <CharacterCount>{reviewText.length}/1000 characters (min 10)</CharacterCount>
              <PostButton 
                onClick={handlePostReview}
                disabled={reviewText.trim().length < 10 || userRating === 0}
              >
                {hasReviewed ? 'Update Review' : 'Post Review'}
              </PostButton>
            </ReviewActions>
          </ReviewForm>
        )}
        
        {/* Show message if not logged in or not watched */}
        {!isAuthenticated && (
          <ReviewForm>
            <p style={{ textAlign: 'center', color: 'var(--galaxy-text-secondary)', margin: 0 }}>
              Please <a href="/login" style={{ color: 'var(--accent-blue)' }}>login</a> to leave a review
            </p>
          </ReviewForm>
        )}
        
        {isAuthenticated && !watched && (
          <ReviewForm>
            <p style={{ textAlign: 'center', color: 'var(--galaxy-text-secondary)', margin: 0 }}>
              Mark this movie as watched to leave a review
            </p>
          </ReviewForm>
        )}

        {/* Reviews List */}
        <ReviewsList>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id}>
                <ReviewHeader>
                  <ReviewerName>
                    {review.user.username}
                    {review.user.id === user?.id && <span style={{ color: 'rgba(102, 126, 234, 0.8)', marginLeft: '8px' }}>(Your Review)</span>}
                  </ReviewerName>
                  <ReviewDate>{new Date(review.created_at).toLocaleDateString()}</ReviewDate>
                </ReviewHeader>
                <ReviewRating>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)} {review.rating}/5
                </ReviewRating>
                {review.review_text && <ReviewText>{review.review_text}</ReviewText>}
              </ReviewCard>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--galaxy-text-secondary)', padding: 'var(--spacing-2xl)' }}>
              No reviews yet. Be the first to review!
            </p>
          )}
        </ReviewsList>
      </ReviewSection>

      {/* CAST SECTION */}
      {movie.Actors && (
        <div style={{ marginTop: 'var(--spacing-3xl)' }}>
          <SectionTitle>Cast</SectionTitle>
          <CastGrid>
            {movie.Actors.split(', ').map((actor, index) => (
              <CastCard key={index}>
                <CastPhoto>{getInitials(actor)}</CastPhoto>
                <div style={{fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px', color: 'var(--galaxy-text-primary)'}}>{actor}</div>
                <div style={{color: 'var(--galaxy-text-secondary)', fontSize: '0.85rem'}}>Actor</div>
              </CastCard>
            ))}
          </CastGrid>
        </div>
      )}
    </Container>
  );
};

export default MovieDetailPage;
