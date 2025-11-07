// PersonalizedFeedPage.js - Friends' trending movies and music
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import API_URL from '../config';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  color: var(--galaxy-text-primary);
  padding: var(--spacing-2xl) var(--spacing-xl);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-sm);
  text-align: center;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--galaxy-text-secondary);
  font-size: 1.2rem;
  margin-bottom: var(--spacing-3xl);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: var(--galaxy-text-primary);
  margin: var(--spacing-3xl) 0 var(--spacing-xl) 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  &::before {
    content: '';
    width: 4px;
    height: 28px;
    background: var(--accent-gradient);
    border-radius: 2px;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-3xl);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-lg);
  }
`;

const MovieCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: var(--border-radius-large);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(138, 101, 234, 0.1));
  
  ${MovieCard}:hover & {
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
    border-color: rgba(102, 126, 234, 0.5);
  }
`;

const MovieInfo = styled.div`
  margin-top: var(--spacing-md);
`;

const MovieTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--galaxy-text-primary);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MovieMeta = styled.div`
  font-size: 0.875rem;
  color: var(--galaxy-text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const FriendReason = styled.div`
  font-size: 0.75rem;
  color: var(--accent-blue);
  background: rgba(102, 126, 234, 0.15);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  margin-top: var(--spacing-sm);
  font-weight: 500;
`;

const MusicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-3xl);
`;

const MusicCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  
  &:hover {
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }
`;

const AlbumArt = styled.img`
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius);
  object-fit: cover;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(138, 101, 234, 0.1));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const MusicInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

const TrackName = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArtistName = styled.div`
  font-size: 0.9rem;
  color: var(--galaxy-text-secondary);
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MusicReason = styled.div`
  font-size: 0.8rem;
  color: var(--accent-blue);
  background: rgba(102, 126, 234, 0.15);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-weight: 500;
  align-self: flex-start;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-5xl) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: var(--galaxy-text-secondary);
  margin-bottom: var(--spacing-3xl);
  
  h3 {
    color: var(--galaxy-text-primary);
    margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: var(--spacing-sm) 0 0 0;
    line-height: 1.6;
    font-size: 1.05rem;
  }
`;

const PersonalizedFeedPage = () => {
  const navigate = useNavigate();
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchRecommendations = async () => {
    try {
      const [moviesResponse, musicResponse] = await Promise.all([
        axios.get(`${API_URL}/api/accounts/recommendations/movies/`, {
          headers: { Authorization: `Token ${token}` }
        }).catch(() => ({ data: { recommendations: [] } })),
        axios.get(`${API_URL}/api/accounts/recommendations/music/`, {
          headers: { Authorization: `Token ${token}` }
        }).catch(() => ({ data: { recommendations: [] } }))
      ]);
      
      setMovieRecommendations(moviesResponse.data.recommendations || []);
      setMusicRecommendations(musicResponse.data.recommendations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <PageTitle>Loading your feed...</PageTitle>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <PageTitle>✨ For You</PageTitle>
        <Subtitle>Based on your friends' activity</Subtitle>
        
        <SectionTitle>🍿 Movies Your Friends Love</SectionTitle>
        {movieRecommendations.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '4rem' }}>🎬</div>
            <h3>No Movie Recommendations Yet</h3>
            <p>
              Follow some friends and they'll start rating movies!<br />
              Movies with 4+ stars and loved movies from your friends will appear here.
            </p>
          </EmptyState>
        ) : (
          <MovieGrid>
            {movieRecommendations.map(movie => (
              <MovieCard key={movie.imdb_id} onClick={() => navigate(`/movie/${movie.imdb_id}`)}>
                {movie.poster_url && movie.poster_url !== 'N/A' ? (
                  <MoviePoster src={movie.poster_url} alt={movie.title} />
                ) : (
                  <MoviePoster as="div" />
                )}
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieMeta>
                    {movie.year && <span>{movie.year}</span>}
                    {movie.user_rating && <span> • ⭐ {movie.user_rating}/5</span>}
                  </MovieMeta>
                  {movie.reason && (
                    <FriendReason>{movie.reason}</FriendReason>
                  )}
                </MovieInfo>
              </MovieCard>
            ))}
          </MovieGrid>
        )}

        <SectionTitle>🎵 Music Your Friends Are Listening To</SectionTitle>
        {musicRecommendations.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '4rem' }}>🎧</div>
            <h3>No Music Recommendations Yet</h3>
            <p>
              Your friends need to connect Spotify and start listening!<br />
              You'll see their liked songs and recently played tracks here.
            </p>
          </EmptyState>
        ) : (
          <MusicGrid>
            {musicRecommendations.map((track, index) => (
              <MusicCard key={`${track.spotify_track_id}-${index}`}>
                {track.album_image_url ? (
                  <AlbumArt src={track.album_image_url} alt={track.album_name} />
                ) : (
                  <AlbumArt as="div" />
                )}
                <MusicInfo>
                  <TrackName>{track.track_name}</TrackName>
                  <ArtistName>{track.artist_name}</ArtistName>
                  <MusicReason>
                    {track.type === 'trending' && `🔥 ${track.reason}`}
                    {track.type === 'liked' && `♥ ${track.reason}`}
                  </MusicReason>
                </MusicInfo>
              </MusicCard>
            ))}
          </MusicGrid>
        )}
      </Container>
    </PageContainer>
  );
};

export default PersonalizedFeedPage;