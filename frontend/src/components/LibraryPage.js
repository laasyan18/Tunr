// LibraryPage.js - User library with Movies and Music tabs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
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

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: var(--spacing-3xl);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0 0 var(--spacing-md) 0;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: var(--galaxy-text-secondary);
  font-size: 1.1rem;
  margin: 0;
`;

const TabBar = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-3xl);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--accent-blue)' : 'transparent'};
  color: ${props => props.active ? 'var(--galaxy-text-primary)' : 'var(--galaxy-text-secondary)'};
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
  
  &:hover {
    color: var(--galaxy-text-primary);
    background: rgba(102, 126, 234, 0.15);
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-2xl);
  
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

const MovieYear = styled.p`
  font-size: 0.9rem;
  color: var(--galaxy-text-secondary);
  margin: 0;
`;

const RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(255, 215, 0, 0.1);
  border-radius: var(--border-radius);
  color: #FFD700;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: var(--spacing-xs);
`;

// Music styles
const MusicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const MusicCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateX(4px);
  }
`;

const AlbumArt = styled.div`
  width: 64px;
  height: 64px;
  border-radius: var(--border-radius);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(138, 101, 234, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const MusicInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

const MusicTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MusicSubtitle = styled.div`
  font-size: 0.9rem;
  color: var(--galaxy-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MusicSection = styled.div`
  margin-bottom: var(--spacing-3xl);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--galaxy-text-primary);
  margin: 0 0 var(--spacing-xl) 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: var(--accent-gradient);
    border-radius: 2px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-5xl) var(--spacing-xl);
  color: var(--galaxy-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin: 0 0 var(--spacing-md) 0;
`;

const EmptySubtext = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.7;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: var(--galaxy-text-secondary);
`;

const LibraryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('watched');
  const [library, setLibrary] = useState({
    watched: [],
    want_to_watch: [],
    loved: []
  });
  const [musicLibrary, setMusicLibrary] = useState({
    liked_songs: [],
    saved_playlists: []
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchLibrary();
    fetchMusicLibrary();
  }, [token, navigate]);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/movies/library/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLibrary(data.library);
      } else {
        console.error('Library fetch failed:', data);
      }
    } catch (error) {
      console.error('Failed to fetch library:', error);
      alert('Failed to load library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMusicLibrary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/spotify/library/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.status === 401) {
        // User not logged into Spotify, that's okay
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMusicLibrary(data.library);
      }
    } catch (error) {
      console.error('Failed to fetch music library:', error);
      // Don't show alert for music library errors - it's optional
    }
  };

  const getCurrentMovies = () => {
    return library[activeTab] || [];
  };

  const getTabCount = (tab) => {
    return library[tab]?.length || 0;
  };

  const getMusicTabCount = () => {
    return (musicLibrary.liked_songs?.length || 0) + (musicLibrary.saved_playlists?.length || 0);
  };

  const getEmptyMessage = () => {
    const messages = {
      watched: {
        icon: '🎬',
        text: 'No movies watched yet',
        subtext: 'Start watching and mark movies you\'ve seen!'
      },
      want_to_watch: {
        icon: '📌',
        text: 'Your watchlist is empty',
        subtext: 'Add movies you want to watch'
      },
      loved: {
        icon: '♥',
        text: 'No loved movies yet',
        subtext: 'Love your absolute favorites!'
      },
      music: {
        icon: '🎵',
        text: 'No music saved yet',
        subtext: 'Heart songs and playlists to save them here!'
      }
    };
    
    return messages[activeTab];
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingContainer>Loading your library...</LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  const currentMovies = getCurrentMovies();
  const emptyMessage = getEmptyMessage();

  return (
    <PageContainer>
        <ContentWrapper>
          <Header>
            <Title>My Library</Title>
            <Subtitle>Your personal collection</Subtitle>
          </Header>

          <TabBar>
            <Tab 
              active={activeTab === 'watched'} 
              onClick={() => setActiveTab('watched')}
            >
              Watched ({getTabCount('watched')})
            </Tab>
            <Tab 
              active={activeTab === 'want_to_watch'} 
              onClick={() => setActiveTab('want_to_watch')}
            >
              Want to Watch ({getTabCount('want_to_watch')})
            </Tab>
            <Tab 
              active={activeTab === 'loved'} 
              onClick={() => setActiveTab('loved')}
            >
              Loved ({getTabCount('loved')})
            </Tab>
            <Tab 
              active={activeTab === 'music'} 
              onClick={() => setActiveTab('music')}
            >
              Music ({getMusicTabCount()})
            </Tab>
          </TabBar>

          {activeTab === 'music' ? (
            // Music Library View
            (musicLibrary.liked_songs?.length > 0 || musicLibrary.saved_playlists?.length > 0) ? (
              <>
                {musicLibrary.liked_songs?.length > 0 && (
                  <MusicSection>
                    <SectionTitle>♥ Liked Songs</SectionTitle>
                    <MovieGrid>
                      {musicLibrary.liked_songs.map((song) => (
                        <MovieCard key={song.id}>
                          <MoviePoster 
                            src={song.album_image_url || 'https://placehold.co/300x300/667eea/ffffff?text=Song'} 
                            alt={song.track_name}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/300x300/667eea/ffffff?text=Song';
                            }}
                          />
                          <MovieInfo>
                            <MovieTitle>{song.track_name}</MovieTitle>
                            <MovieYear>{song.artist_name}</MovieYear>
                          </MovieInfo>
                        </MovieCard>
                      ))}
                    </MovieGrid>
                  </MusicSection>
                )}
                
                {musicLibrary.saved_playlists?.length > 0 && (
                  <MusicSection>
                    <SectionTitle>📚 Saved Playlists</SectionTitle>
                    <MovieGrid>
                      {musicLibrary.saved_playlists.map((playlist) => (
                        <MovieCard key={playlist.id}>
                          <MoviePoster 
                            src={playlist.playlist_image_url || 'https://placehold.co/300x300/48bb78/ffffff?text=Playlist'} 
                            alt={playlist.playlist_name}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/300x300/48bb78/ffffff?text=Playlist';
                            }}
                          />
                          <MovieInfo>
                            <MovieTitle>{playlist.playlist_name}</MovieTitle>
                            <MovieYear>Playlist</MovieYear>
                          </MovieInfo>
                        </MovieCard>
                      ))}
                    </MovieGrid>
                  </MusicSection>
                )}
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>{emptyMessage.icon}</EmptyIcon>
                <EmptyText>{emptyMessage.text}</EmptyText>
                <EmptySubtext>{emptyMessage.subtext}</EmptySubtext>
              </EmptyState>
            )
          ) : (
            // Movie Library View
            currentMovies.length > 0 ? (
              <MovieGrid>
                {currentMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    onClick={() => navigate(`/movie/${movie.imdb_id}`)}
                  >
                    <MoviePoster 
                      src={movie.poster || '/placeholder-movie.png'} 
                      alt={movie.title}
                    />
                    <MovieInfo>
                      <MovieTitle>{movie.title}</MovieTitle>
                      <MovieYear>{movie.year}</MovieYear>
                      {movie.user_rating && (
                        <RatingBadge>
                          ★ {movie.user_rating}/5
                        </RatingBadge>
                      )}
                    </MovieInfo>
                  </MovieCard>
                ))}
              </MovieGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>{emptyMessage.icon}</EmptyIcon>
                <EmptyText>{emptyMessage.text}</EmptyText>
                <EmptySubtext>{emptyMessage.subtext}</EmptySubtext>
              </EmptyState>
            )
          )}
        </ContentWrapper>
      </PageContainer>
  );
};

export default LibraryPage;