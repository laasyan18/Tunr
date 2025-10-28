// MovieDetailPage.js - Complete with Reviews
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';

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
  const [liked, setLiked] = useState(false);
  const [watched, setWatched] = useState(false);
  const [wantToWatch, setWantToWatch] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Review states
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'MovieBuff2023',
      rating: 4,
      text: 'An incredible cinematic experience! The visuals were stunning and the story kept me engaged throughout.',
      date: '2 days ago'
    },
    {
      id: 2,
      author: 'CinemaLover',
      rating: 5,
      text: 'Perfect blend of action and emotion. One of the best films I\'ve seen this year!',
      date: '1 week ago'
    }
  ]);
  
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000));

  useEffect(() => {
    // Fetch movie data - your existing fetch logic
    const fetchMovie = async () => {
      try {
          setLoading(true);
          // Read OMDB key from environment (REACT_APP_ prefix required for CRA)
          const apiKey = process.env.REACT_APP_OMDB_API_KEY;
          if (!apiKey) {
            console.warn('OMDB API key not found. Set REACT_APP_OMDB_API_KEY in frontend/.env.local or in your environment.');
          }
          const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
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

    if (id) fetchMovie();
  }, [id]);

  // Update your debug useEffect to actually set the user state
useEffect(() => {
  console.log('=== DEBUG: Checking localStorage ===');
  console.log('Token:', localStorage.getItem('token'));
  console.log('User data:', localStorage.getItem('user'));
  
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      console.log('Username:', parsedUser.username);
      
      // ACTUALLY SET THE STATE ⬇️
      setUser(parsedUser);
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  } else {
    console.log('No user data found - user not logged in');
    setUser(null);
    setIsAuthenticated(false);
  }
  console.log('=== END DEBUG ===');
}, []);



  const handlePostReview = () => {
    if (reviewText.trim().length < 10) return;
    
    const newReview = {
    id: Date.now(), // Temporary ID
    author: user?.username || 'Anonymous', // Use actual username here
    rating: userRating,
    text: reviewText,
    date: 'Just now',
    user_id: user?.id
    };
    
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setWatched(true); // Auto-mark as watched when reviewing
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
            <Stat><span className="icon">⭐</span><span>{movie.imdbRating}/10 IMDb</span></Stat>
            <Stat><span className="icon">❤️</span><span>{likeCount.toLocaleString()} likes</span></Stat>
            <Stat><span className="icon">📝</span><span>{reviews.length} reviews</span></Stat>
            <Stat><span className="icon">🎬</span><span>{movie.Runtime}</span></Stat>
          </MovieStats>

          <UserActions>
            <ActionButton active={liked} onClick={() => setLiked(!liked)}>
              ❤️ {liked ? 'Loved' : 'Like'}
            </ActionButton>
            <ActionButton active={watched} onClick={() => setWatched(!watched)}>
              👁️ {watched ? 'Watched' : 'Watch'}
            </ActionButton>
            <ActionButton active={wantToWatch} onClick={() => setWantToWatch(!wantToWatch)}>
              🎯 {wantToWatch ? 'Want to Watch' : 'Watchlist'}
            </ActionButton>
          </UserActions>

          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--galaxy-text-primary)' }}>Rate this movie:</h4>
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
              <span style={{ marginLeft: '1rem', color: 'var(--galaxy-text-secondary)' }}>
                {userRating > 0 ? `${userRating}/5 stars` : 'Click to rate'}
              </span>
            </StarRating>
          </div>
          
          <div>
            <h3 style={{ color: 'var(--galaxy-text-primary)', marginBottom: 'var(--spacing-md)' }}>Plot</h3>
            <p style={{ color: 'var(--galaxy-text-secondary)', lineHeight: '1.68' }}>{movie.Plot}</p>
          </div>
        </MovieInfo>
      </MovieHeader>

      {/* REVIEW SECTION */}
      <ReviewSection>
        <SectionTitle>Reviews ({reviews.length})</SectionTitle>
        
        {/* Write Review Form */}
        <ReviewForm>
          <h3 style={{ marginTop: 0, marginBottom: 'var(--spacing-lg)', color: 'var(--galaxy-text-primary)' }}>
            Write a Review as {user?.username || 'Unknown User'}
          </h3>
          <ReviewTextarea
            placeholder="Share your thoughts about this movie... What did you like? What didn't work for you?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={1000}
          />
          <ReviewActions>
            <CharacterCount>{reviewText.length}/1000 characters</CharacterCount>
            <PostButton 
              onClick={handlePostReview}
              disabled={reviewText.trim().length < 10}
            >
              Post Review
            </PostButton>
          </ReviewActions>
        </ReviewForm>

        {/* Reviews List */}
        <ReviewsList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <ReviewHeader>
                <ReviewerName>
                    {review.author}
                    {review.user_id === user?.id && <span style={{ color: 'rgba(102, 126, 234, 0.8)', marginLeft: '8px' }}>(Your Review)</span>}
                </ReviewerName>
                <ReviewDate>{review.date}</ReviewDate>
              </ReviewHeader>
              {review.rating > 0 && (
                <ReviewRating>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)} {review.rating}/5
                </ReviewRating>
              )}
              <ReviewText>{review.text}</ReviewText>
            </ReviewCard>
          ))}
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
