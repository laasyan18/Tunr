// MovieDetailPage.js - Complete with Reviews
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  color: var(--text-primary);
  font-family: var(--font-primary);
  background: var(--background-primary);
`;

const MovieHeader = styled.div`
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-3xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const MovieTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.1;
`;

const MovieYear = styled.span`
  color: var(--text-secondary);
  font-size: 1.125rem;
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
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  .icon {
    font-size: 1rem;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 20px;
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-primary)'};
  background: ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  font-family: var(--font-primary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
  color: ${props => props.filled ? '#FFD700' : 'var(--border-primary)'};
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
  border-top: 2px solid var(--border-primary);
`;

const ReviewForm = styled.div`
  background: var(--background-surface);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  background: var(--background-primary);
  color: var(--text-primary);
  font-family: var(--font-primary);
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
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
  color: var(--text-tertiary);
`;

const PostButton = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 25px;
  font-family: var(--font-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
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
  background: var(--background-surface);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  border-left: 4px solid var(--accent-primary);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const ReviewDate = styled.div`
  font-size: 0.875rem;
  color: var(--text-tertiary);
`;

const ReviewRating = styled.div`
  color: #FFD700;
  margin-bottom: var(--spacing-sm);
`;

const ReviewText = styled.p`
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: var(--accent-primary);
    border-radius: 2px;
  }
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-lg);
`;

const CastCard = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  background: var(--background-surface);
  border-radius: var(--border-radius-large);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const CastPhoto = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md) auto;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
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
        const apiKey = 'eada15a9';
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
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Rate this movie:</h4>
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
              <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
                {userRating > 0 ? `${userRating}/5 stars` : 'Click to rate'}
              </span>
            </StarRating>
          </div>
          
          <div>
            <h3>Plot</h3>
            <p>{movie.Plot}</p>
          </div>
        </MovieInfo>
      </MovieHeader>

      {/* REVIEW SECTION */}
      <ReviewSection>
        <SectionTitle>Reviews ({reviews.length})</SectionTitle>
        
        {/* Write Review Form */}
        <ReviewForm>
          <h3 style={{ marginTop: 0, marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>
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
                    {review.user_id === user?.id && <span style={{ color: 'var(--accent-primary)', marginLeft: '8px' }}>(Your Review)</span>}
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
                <div style={{fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px'}}>{actor}</div>
                <div style={{color: 'var(--text-tertiary)', fontSize: '0.75rem'}}>Actor</div>
              </CastCard>
            ))}
          </CastGrid>
        </div>
      )}
    </Container>
  );
};

export default MovieDetailPage;
