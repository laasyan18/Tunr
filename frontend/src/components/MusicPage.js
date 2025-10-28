// MusicPage.js - Beautiful redesigned music dashboard
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import TunrNavigation from './TunrNavigation';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  font-family: var(--font-primary);
  color: var(--galaxy-text-primary);
  position: relative;
  overflow-x: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  padding: var(--spacing-2xl) var(--spacing-xl);
  
  &::before, &::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
  }
  
  &::before {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
    top: -300px;
    right: -300px;
    animation: ${float} 6s ease-in-out infinite;
  }
  
  &::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(138, 101, 234, 0.1) 0%, transparent 70%);
    bottom: -200px;
    left: -200px;
    animation: ${float} 8s ease-in-out infinite;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const LoginContainer = styled.div`
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: var(--spacing-lg);
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.022em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: var(--spacing-2xl);
  color: var(--galaxy-text-secondary);
  line-height: 1.6;
  max-width: 600px;
`;

const SpotifyButton = styled.button`
  padding: var(--spacing-xl) var(--spacing-3xl);
  font-size: 1.125rem;
  background: #1DB954;
  color: white;
  border: none;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  font-family: var(--font-primary);
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(29, 185, 84, 0.35);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: #1ed760;
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 32px rgba(29, 185, 84, 0.45);
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-3xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  
  h2 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--galaxy-text-primary);
    font-size: 2rem;
    font-weight: 700;
  }
  
  p {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--galaxy-text-secondary);
    font-size: 1.05rem;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--border-radius-full);
  color: var(--galaxy-text-primary);
  font-size: 0.95rem;
  font-weight: 600;
`;

const Section = styled.section`
  margin-bottom: var(--spacing-3xl);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--galaxy-text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .count {
    color: var(--galaxy-text-secondary);
    font-size: 1.125rem;
    font-weight: 500;
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-xl);
`;

const PlaylistCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--accent-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.25);
  }
  
  &:hover::before {
    opacity: 0.05;
  }
`;

const PlaylistImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaylistName = styled.h3`
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--galaxy-text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PlaylistInfo = styled.p`
  margin: 0;
  color: var(--galaxy-text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const TrackCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateX(8px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  }
`;

const TrackImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TrackArtist = styled.div`
  font-size: 0.95rem;
  color: var(--galaxy-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlayButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.isPlaying ? 'rgba(102, 126, 234, 0.8)' : props.disabled ? 'rgba(128, 128, 128, 0.3)' : 'var(--accent-gradient)'};
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  
  &:hover:not(:disabled) {
    transform: scale(1.15);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: rgba(128, 128, 128, 0.3);
  }
  
  &:disabled::after {
    content: '🚫';
    position: absolute;
    font-size: 0.7rem;
    bottom: -2px;
    right: -2px;
  }
`;

const ArtistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-xl);
`;

const ArtistCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-12px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.25);
  }
`;

const ArtistImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto var(--spacing-lg) auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border: 3px solid rgba(102, 126, 234, 0.3);
  overflow: hidden;
  background: var(--accent-gradient);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ArtistName = styled.h3`
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--galaxy-text-primary);
  font-size: 1.05rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArtistGenre = styled.p`
  margin: 0;
  color: var(--galaxy-text-secondary);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-3xl);
  color: var(--galaxy-text-secondary);
  font-size: 1.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-3xl);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-large);
  
  h3 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--galaxy-text-primary);
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    color: var(--galaxy-text-secondary);
    font-size: 1.05rem;
  }
`;

const SearchSection = styled.div`
  margin-bottom: var(--spacing-3xl);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-2xl);
`;

const SearchBar = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--border-radius-full);
  color: var(--galaxy-text-primary);
  font-size: 1.05rem;
  font-family: var(--font-primary);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--galaxy-text-secondary);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.6);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: var(--spacing-lg) var(--spacing-3xl);
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--border-radius-full);
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 600px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.7);
  }
`;

const SearchResultsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  
  h3 {
    margin: 0;
    color: var(--galaxy-text-primary);
    font-size: 1.25rem;
  }
  
  span {
    color: var(--galaxy-text-secondary);
    font-size: 0.95rem;
  }
`;

const NowPlaying = styled.div`
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  background: var(--accent-gradient);
  color: white;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--border-radius-full);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-weight: 600;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  
  &::before {
    content: '🎵';
    font-size: 1.5rem;
    animation: ${float} 1s ease-in-out infinite;
  }
`;

const MusicPage = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // User's Spotify data
  const [playlists, setPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [following, setFollowing] = useState([]);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spotify/user/', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        // Fetch all data in parallel
        await Promise.all([
          fetchUserPlaylists(),
          fetchTopTracks(),
          fetchRecentlyPlayed(),
          fetchFollowing()
        ]);
      }
    } catch (error) {
      console.log('User not authenticated with Spotify');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spotify/playlists/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  const fetchTopTracks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spotify/top-tracks/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTopTracks(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch top tracks:', error);
    }
  };

  const fetchRecentlyPlayed = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spotify/recently-played/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRecentlyPlayed(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch recently played:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spotify/following/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFollowing(data.artists?.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  const searchMusic = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setSearchResults([]);
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/spotify/search/?q=${encodeURIComponent(searchQuery)}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.tracks?.items?.slice(0, 20) || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMusic();
    }
  };

  const loginWithSpotify = () => {
    // If user has an API token stored (from login), pass it as state so backend can link Spotify to the Tunr user
    const token = localStorage.getItem('token');
    const url = token
      ? `http://127.0.0.1:8000/spotify/login/?state=${encodeURIComponent(token)}`
      : 'http://127.0.0.1:8000/spotify/login/';
    window.location.href = url;
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <>
        <TunrNavigation />
        <PageContainer>
          <LoginContainer>
            <Title>🎵 Discover Your Music</Title>
            <Subtitle>
              Connect your Spotify account to explore your playlists, top tracks, and favorite artists
            </Subtitle>
            <SpotifyButton onClick={loginWithSpotify}>
              🎵 Connect with Spotify
            </SpotifyButton>
          </LoginContainer>
        </PageContainer>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <TunrNavigation />
        <PageContainer>
          <ContentWrapper>
            <LoadingSpinner>🎵 Loading your music...</LoadingSpinner>
          </ContentWrapper>
        </PageContainer>
      </>
    );
  }

  // Main dashboard
  return (
    <>
      <TunrNavigation />
      <PageContainer>
      <ContentWrapper>
        {/* Welcome Card */}
        <WelcomeCard>
          <UserAvatar>
            {user?.images?.[0]?.url ? (
              <img src={user.images[0].url} alt={user.display_name} />
            ) : (
              user?.display_name?.[0]?.toUpperCase() || '🎵'
            )}
          </UserAvatar>
          <UserInfo>
            <h2>Welcome back, {user?.display_name}!</h2>
            <p>{user?.email} • {user?.country || 'Spotify'}</p>
            <StatsRow>
              <StatBadge>📚 {playlists.length} Playlists</StatBadge>
              <StatBadge>⭐ {topTracks.length} Top Tracks</StatBadge>
              <StatBadge>👥 {following.length} Following</StatBadge>
            </StatsRow>
          </UserInfo>
        </WelcomeCard>

        {/* Search Section */}
        <SearchSection>
          <h2 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--galaxy-text-primary)', fontSize: '1.5rem' }}>
            🔍 Search Music
          </h2>
          <p style={{ margin: '0 0 var(--spacing-lg) 0', color: 'var(--galaxy-text-secondary)', fontSize: '0.95rem' }}>
            Search for songs, artists, and albums on Spotify
          </p>
          <SearchBar>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search for songs, artists, albums..."
            />
            <SearchButton onClick={searchMusic} disabled={searching || !searchQuery.trim()}>
              {searching ? '🔍 Searching...' : '🔍 Search'}
            </SearchButton>
          </SearchBar>
          
          {searchResults.length > 0 && (
            <>
              <SearchResultsHeader>
                <h3>🎵 Search Results</h3>
                <span>{searchResults.length} tracks found</span>
              </SearchResultsHeader>
              <SearchResults>
                {searchResults.map((track) => (
                  <TrackCard key={track.id} onClick={() => window.open(track.external_urls.spotify, '_blank')}>
                    <TrackImage 
                      src={track.album.images[2]?.url || track.album.images[0]?.url} 
                      alt={track.name}
                    />
                    <TrackInfo>
                      <TrackName>{track.name}</TrackName>
                      <TrackArtist>
                        {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                      </TrackArtist>
                    </TrackInfo>
                  </TrackCard>
                ))}
              </SearchResults>
            </>
          )}
          
          {searchQuery && searchResults.length === 0 && !searching && (
            <EmptyState>
              <h3>No Results Found</h3>
              <p>Try searching with different keywords</p>
            </EmptyState>
          )}
        </SearchSection>

        {/* My Playlists Section */}
        <Section>
          <SectionHeader>
            <h2>📚 My Playlists</h2>
            <span className="count">{playlists.length} playlists</span>
          </SectionHeader>
          {playlists.length > 0 ? (
            <PlaylistGrid>
              {playlists.map((playlist) => (
                <PlaylistCard 
                  key={playlist.id}
                  onClick={() => window.open(playlist.external_urls.spotify, '_blank')}
                >
                  <PlaylistImage>
                    {playlist.images?.[0]?.url ? (
                      <img src={playlist.images[0].url} alt={playlist.name} />
                    ) : (
                      '🎵'
                    )}
                  </PlaylistImage>
                  <PlaylistName>{playlist.name}</PlaylistName>
                  <PlaylistInfo>
                    <span>🎵</span> {playlist.tracks.total} tracks
                  </PlaylistInfo>
                </PlaylistCard>
              ))}
            </PlaylistGrid>
          ) : (
            <EmptyState>
              <h3>No playlists yet</h3>
              <p>Create playlists on Spotify to see them here!</p>
            </EmptyState>
          )}
        </Section>

        {/* Top Tracks Section */}
        <Section>
          <SectionHeader>
            <h2>⭐ Your Top Tracks</h2>
            <span className="count">Last 4 weeks</span>
          </SectionHeader>
          {topTracks.length > 0 ? (
            <TrackList>
              {topTracks.slice(0, 10).map((track, index) => (
                <TrackCard key={track.id} onClick={() => window.open(track.external_urls.spotify, '_blank')}>
                  <TrackImage 
                    src={track.album.images[2]?.url || track.album.images[0]?.url} 
                    alt={track.name}
                  />
                  <TrackInfo>
                    <TrackName>#{index + 1} • {track.name}</TrackName>
                    <TrackArtist>{track.artists.map(a => a.name).join(', ')}</TrackArtist>
                  </TrackInfo>
                </TrackCard>
              ))}
            </TrackList>
          ) : (
            <EmptyState>
              <h3>No top tracks data</h3>
              <p>Listen to more music to see your favorites!</p>
            </EmptyState>
          )}
        </Section>

        {/* Recently Played Section */}
        <Section>
          <SectionHeader>
            <h2>🕒 Recently Played</h2>
            <span className="count">Your listening history</span>
          </SectionHeader>
          {recentlyPlayed.length > 0 ? (
            <TrackList>
              {recentlyPlayed.slice(0, 10).map((item, index) => (
                <TrackCard key={`${item.track.id}-${index}`} onClick={() => window.open(item.track.external_urls.spotify, '_blank')}>
                  <TrackImage 
                    src={item.track.album.images[2]?.url || item.track.album.images[0]?.url} 
                    alt={item.track.name}
                  />
                  <TrackInfo>
                    <TrackName>{item.track.name}</TrackName>
                    <TrackArtist>
                      {item.track.artists.map(a => a.name).join(', ')} • 
                      {new Date(item.played_at).toLocaleTimeString()}
                    </TrackArtist>
                  </TrackInfo>
                </TrackCard>
              ))}
            </TrackList>
          ) : (
            <EmptyState>
              <h3>No recent plays</h3>
              <p>Start listening to music to see your history!</p>
            </EmptyState>
          )}
        </Section>

        {/* Following Section */}
        <Section>
          <SectionHeader>
            <h2>👥 Artists You Follow</h2>
            <span className="count">{following.length} artists</span>
          </SectionHeader>
          {following.length > 0 ? (
            <ArtistGrid>
              {following.slice(0, 12).map((artist) => (
                <ArtistCard 
                  key={artist.id}
                  onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                >
                  <ArtistImage>
                    {artist.images?.[0]?.url ? (
                      <img src={artist.images[0].url} alt={artist.name} />
                    ) : null}
                  </ArtistImage>
                  <ArtistName>{artist.name}</ArtistName>
                  <ArtistGenre>
                    {artist.genres?.[0] || 'Artist'}
                  </ArtistGenre>
                </ArtistCard>
              ))}
            </ArtistGrid>
          ) : (
            <EmptyState>
              <h3>Not following any artists</h3>
              <p>Follow artists on Spotify to see them here!</p>
            </EmptyState>
          )}
        </Section>
      </ContentWrapper>
    </PageContainer>
    </>
  );
};

export default MusicPage;
