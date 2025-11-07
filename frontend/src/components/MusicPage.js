// MusicPage.js - Clean Spotify dashboard with search, recently listened, and followed artists
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import API_URL from '../config';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  font-family: var(--font-primary);
  color: var(--galaxy-text-primary);
  animation: ${fadeIn} 0.6s ease-out;
  padding: var(--spacing-2xl) var(--spacing-xl);
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

const SearchSection = styled.div`
  margin-bottom: var(--spacing-3xl);
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto var(--spacing-xl) auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-lg) var(--spacing-xl);
  padding-right: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--border-radius-full);
  color: var(--galaxy-text-primary);
  font-size: 1.05rem;
  font-family: var(--font-primary);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-blue);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  &::placeholder {
    color: var(--galaxy-text-tertiary);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: var(--spacing-lg);
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  pointer-events: none;
`;

const Section = styled.div`
  margin-bottom: var(--spacing-3xl);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: var(--galaxy-text-primary);
  margin: 0;
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

const ToggleButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--border-radius-full);
  color: var(--galaxy-text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: var(--accent-blue);
  }
`;

const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const TrackCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateX(4px);
  }
  
  &:hover .heart-button {
    opacity: 1;
  }
`;

const HeartButton = styled.button`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: ${props => props.liked ? '#ff4757' : '#fff'};
  
  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.9);
    border-color: ${props => props.liked ? '#ff4757' : 'rgba(255, 255, 255, 0.4)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const AlbumArt = styled.img`
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius);
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(138, 101, 234, 0.1));
`;

const TrackInfo = styled.div`
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArtistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-xl);
`;

const ArtistCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-4px);
  }
`;

const ArtistImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto var(--spacing-md) auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(138, 101, 234, 0.2));
`;

const ArtistNameText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const ArtistGenres = styled.div`
  font-size: 0.85rem;
  color: var(--galaxy-text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-5xl) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
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
  color: var(--galaxy-text-primary);
`;

const SpotifyButton = styled.button`
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: 1.05rem;
  background: #1DB954;
  color: white;
  border: none;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  font-weight: 600;
  font-family: var(--font-primary);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
  
  &:hover {
    background: #1ed760;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(29, 185, 84, 0.4);
  }
`;

const PlaylistSection = styled.div`
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${props => props.show ? '5000px' : '0'};
  opacity: ${props => props.show ? '1' : '0'};
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
`;

const PlaylistCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-4px);
  }
  
  &:hover .heart-button {
    opacity: 1;
  }
`;

const PlaylistHeartButton = styled.button`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: ${props => props.liked ? '#ff4757' : '#fff'};
  z-index: 10;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.9);
    border-color: ${props => props.liked ? '#ff4757' : 'rgba(255, 255, 255, 0.4)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const PlaylistImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(138, 101, 234, 0.2));
`;

const PlaylistInfo = styled.div`
  padding: var(--spacing-lg);
`;

const PlaylistName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaylistTracks = styled.div`
  font-size: 0.85rem;
  color: var(--galaxy-text-secondary);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: var(--galaxy-text-secondary);
`;

const MusicPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [likedPlaylists, setLikedPlaylists] = useState(new Set());

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikedStatus();
    }
  }, [isAuthenticated, recentlyPlayed, searchResults, playlists]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/spotify/playlists/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        const data = await response.json();
        setPlaylists(data.items || []);
        
        await Promise.all([
          fetchRecentlyPlayed(),
          fetchFollowedArtists()
        ]);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentlyPlayed = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/spotify/recently-played/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await response.json();
      setRecentlyPlayed(data.items || []);
    } catch (error) {
      console.error('Failed to fetch recently played:', error);
    }
  };

  const fetchFollowedArtists = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/spotify/following/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await response.json();
      setFollowedArtists(data.artists?.items || []);
    } catch (error) {
      console.error('Failed to fetch followed artists:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/spotify/search/?q=${encodeURIComponent(query)}&type=track,artist,album`,
        { headers: { 'Authorization': `Token ${token}` } }
      );
      const data = await response.json();
      setSearchResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSpotifyConnect = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    // Pass our auth token as state parameter so backend can link Spotify to this user
    window.location.href = `${API_URL}/api/spotify/login/?state=${encodeURIComponent(token)}`;
  };

  const fetchLikedStatus = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Collect all track IDs and playlist IDs
      const trackIds = [
        ...searchResults.map(t => t.id),
        ...recentlyPlayed.map(item => item.track?.id).filter(Boolean)
      ];
      const playlistIds = playlists.map(p => p.id);
      
      if (trackIds.length === 0 && playlistIds.length === 0) return;
      
      const response = await fetch(
        `${API_URL}/api/spotify/check-liked/?track_ids=${trackIds.join(',')}&playlist_ids=${playlistIds.join(',')}`,
        { headers: { 'Authorization': `Token ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setLikedSongs(new Set(data.liked_tracks || []));
        setLikedPlaylists(new Set(data.saved_playlists || []));
      }
    } catch (error) {
      console.error('Failed to fetch liked status:', error);
    }
  };

  const toggleLikeSong = async (track, e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const isLiked = likedSongs.has(track.id);
    
    try {
      const response = await fetch(`${API_URL}/api/spotify/like-song/`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          spotify_track_id: track.id,
          track_name: track.name,
          artist_name: track.artists?.map(a => a.name).join(', ') || '',
          album_name: track.album?.name || '',
          album_image_url: track.album?.images?.[0]?.url || ''
        })
      });
      
      if (response.ok) {
        setLikedSongs(prev => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.delete(track.id);
          } else {
            newSet.add(track.id);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const toggleLikePlaylist = async (playlist, e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const isLiked = likedPlaylists.has(playlist.id);
    
    try {
      const response = await fetch(`${API_URL}/api/spotify/like-playlist/`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          spotify_playlist_id: playlist.id,
          playlist_name: playlist.name,
          playlist_image_url: playlist.images?.[0]?.url || ''
        })
      });
      
      if (response.ok) {
        setLikedPlaylists(prev => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.delete(playlist.id);
          } else {
            newSet.add(playlist.id);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to toggle playlist like:', error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <LoadingContainer>Loading your music...</LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <ContentWrapper>
          <EmptyState>
            <EmptyIcon>🎵</EmptyIcon>
            <EmptyText>Connect Your Spotify Account</EmptyText>
            <p style={{ marginBottom: 'var(--spacing-xl)' }}>
              Discover your recently listened tracks, followed artists, and more
            </p>
            <SpotifyButton onClick={handleSpotifyConnect}>
              Connect with Spotify
            </SpotifyButton>
          </EmptyState>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>Music</Title>
          <Subtitle>Your Spotify dashboard</Subtitle>
        </Header>

        {/* Search Section */}
        <SearchSection>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <SearchIcon>🔍</SearchIcon>
          </SearchBar>

          {searchQuery && (
            <Section>
              <SectionTitle>Search Results</SectionTitle>
              {searching ? (
                <EmptyState>
                  <EmptyText>Searching...</EmptyText>
                </EmptyState>
              ) : searchResults.length > 0 ? (
                <TrackGrid>
                  {searchResults.slice(0, 12).map((track, index) => (
                    <TrackCard key={`${track.id}-${index}`}>
                      <HeartButton
                        className="heart-button"
                        liked={likedSongs.has(track.id)}
                        onClick={(e) => toggleLikeSong(track, e)}
                        title={likedSongs.has(track.id) ? 'Unlike' : 'Like'}
                      >
                        {likedSongs.has(track.id) ? '♥' : '♡'}
                      </HeartButton>
                      {track.album?.images?.[0] && (
                        <AlbumArt src={track.album.images[0].url} alt={track.album.name} />
                      )}
                      <TrackInfo>
                        <TrackName>{track.name}</TrackName>
                        <ArtistName>{track.artists?.map(a => a.name).join(', ')}</ArtistName>
                      </TrackInfo>
                    </TrackCard>
                  ))}
                </TrackGrid>
              ) : (
                <EmptyState>
                  <EmptyText>No results found</EmptyText>
                </EmptyState>
              )}
            </Section>
          )}
        </SearchSection>

        {!searchQuery && (
          <>
            {/* Recently Listened */}
            <Section>
              <SectionTitle>🎧 Recently Listened</SectionTitle>
              {recentlyPlayed.length > 0 ? (
                <TrackGrid>
                  {recentlyPlayed.slice(0, 12).map((item, index) => (
                    <TrackCard key={`${item.track?.id}-${index}`}>
                      <HeartButton
                        className="heart-button"
                        liked={likedSongs.has(item.track?.id)}
                        onClick={(e) => toggleLikeSong(item.track, e)}
                        title={likedSongs.has(item.track?.id) ? 'Unlike' : 'Like'}
                      >
                        {likedSongs.has(item.track?.id) ? '♥' : '♡'}
                      </HeartButton>
                      {item.track?.album?.images?.[0] && (
                        <AlbumArt src={item.track.album.images[0].url} alt={item.track.album.name} />
                      )}
                      <TrackInfo>
                        <TrackName>{item.track?.name}</TrackName>
                        <ArtistName>{item.track?.artists?.map(a => a.name).join(', ')}</ArtistName>
                      </TrackInfo>
                    </TrackCard>
                  ))}
                </TrackGrid>
              ) : (
                <EmptyState>
                  <EmptyIcon>🎶</EmptyIcon>
                  <EmptyText>No recently played tracks</EmptyText>
                </EmptyState>
              )}
            </Section>

            {/* Followed Artists */}
            <Section>
              <SectionTitle>👥 Followed Artists</SectionTitle>
              {followedArtists.length > 0 ? (
                <ArtistGrid>
                  {followedArtists.map((artist) => (
                    <ArtistCard key={artist.id}>
                      {artist.images?.[0] && (
                        <ArtistImage src={artist.images[0].url} alt={artist.name} />
                      )}
                      <ArtistNameText>{artist.name}</ArtistNameText>
                      {artist.genres && artist.genres.length > 0 && (
                        <ArtistGenres>{artist.genres.slice(0, 2).join(', ')}</ArtistGenres>
                      )}
                    </ArtistCard>
                  ))}
                </ArtistGrid>
              ) : (
                <EmptyState>
                  <EmptyIcon>🎤</EmptyIcon>
                  <EmptyText>No followed artists</EmptyText>
                </EmptyState>
              )}
            </Section>

            {/* Playlists - Collapsible */}
            <Section>
              <SectionHeader>
                <SectionTitle>📚 My Playlists</SectionTitle>
                <ToggleButton onClick={() => setShowPlaylists(!showPlaylists)}>
                  {showPlaylists ? 'Hide' : 'Show'} Playlists
                </ToggleButton>
              </SectionHeader>
              
              <PlaylistSection show={showPlaylists}>
                {playlists.length > 0 ? (
                  <PlaylistGrid>
                    {playlists.map((playlist) => (
                      <PlaylistCard key={playlist.id}>
                        <PlaylistHeartButton
                          className="heart-button"
                          liked={likedPlaylists.has(playlist.id)}
                          onClick={(e) => toggleLikePlaylist(playlist, e)}
                          title={likedPlaylists.has(playlist.id) ? 'Remove from library' : 'Save to library'}
                        >
                          {likedPlaylists.has(playlist.id) ? '♥' : '♡'}
                        </PlaylistHeartButton>
                        {playlist.images?.[0] && (
                          <PlaylistImage src={playlist.images[0].url} alt={playlist.name} />
                        )}
                        <PlaylistInfo>
                          <PlaylistName>{playlist.name}</PlaylistName>
                          <PlaylistTracks>{playlist.tracks?.total || 0} tracks</PlaylistTracks>
                        </PlaylistInfo>
                      </PlaylistCard>
                    ))}
                  </PlaylistGrid>
                ) : (
                  <EmptyState>
                    <EmptyIcon>📚</EmptyIcon>
                    <EmptyText>No playlists found</EmptyText>
                  </EmptyState>
                )}
              </PlaylistSection>
            </Section>
          </>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default MusicPage;
