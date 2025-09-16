// MusicPage.js - Updated with better styling and error handling
import React, { useState, useEffect } from 'react';

const MusicPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
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
      }
    } catch (error) {
      console.log('User not authenticated with Spotify');
    }
  };

  const loginWithSpotify = () => {
    window.location.href = 'http://127.0.0.1:8000/spotify/login/';
  };

  const searchMusic = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/spotify/search/?q=${encodeURIComponent(searchQuery)}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.tracks?.items || []);
      
      if (data.tracks?.items?.length === 0) {
        setError('No results found. Try different keywords.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Login screen - matches your project's styling
  if (!isAuthenticated) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px',
        background: 'var(--galaxy-bg, #0a0a0a)',
        color: 'var(--galaxy-text-primary, #ffffff)',
        minHeight: '80vh',
        fontFamily: 'var(--font-primary, Arial, sans-serif)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-heading, Arial, sans-serif)',
          color: 'var(--galaxy-text-primary, #ffffff)'
        }}>
          🎵 Music Discovery
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: 'var(--galaxy-text-secondary, #cccccc)'
        }}>
          Connect your Spotify account to discover amazing music
        </p>
        <button 
          onClick={loginWithSpotify} 
          style={{ 
            padding: '15px 30px', 
            fontSize: '16px',
            backgroundColor: '#1DB954',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontFamily: 'var(--font-primary, Arial, sans-serif)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(29, 185, 84, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1ed760';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1DB954';
            e.target.style.transform = 'scale(1)';
          }}
        >
          🎵 Login with Spotify
        </button>
      </div>
    );
  }

  // Main music page
  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '40px 20px',
      background: 'var(--galaxy-bg, #0a0a0a)',
      color: 'var(--galaxy-text-primary, #ffffff)',
      fontFamily: 'var(--font-primary, Arial, sans-serif)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '10px',
          fontFamily: 'var(--font-heading, Arial, sans-serif)',
          color: 'var(--galaxy-text-primary, #ffffff)'
        }}>
          🎵 Music Discovery
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          color: 'var(--galaxy-text-secondary, #cccccc)'
        }}>
          Welcome back, <strong>{user?.display_name}</strong>!
        </p>
      </div>
      
      {/* Search Section */}
      <div style={{ 
        marginBottom: '40px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs, artists, albums..."
          style={{ 
            flex: 1,
            maxWidth: '500px',
            padding: '15px 20px', 
            fontSize: '16px',
            border: '2px solid var(--galaxy-border, #333)',
            borderRadius: '25px',
            backgroundColor: 'var(--galaxy-surface, #1a1a1a)',
            color: 'var(--galaxy-text-primary, #ffffff)',
            fontFamily: 'var(--font-primary, Arial, sans-serif)',
            outline: 'none'
          }}
          onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary, #1DB954)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--galaxy-border, #333)'}
        />
        <button 
          onClick={searchMusic} 
          disabled={loading}
          style={{ 
            padding: '15px 25px',
            fontSize: '16px',
            backgroundColor: loading ? '#666' : 'var(--accent-primary, #1DB954)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-primary, Arial, sans-serif)',
            transition: 'all 0.3s ease',
            minWidth: '120px'
          }}
        >
          {loading ? '🔍 Searching...' : '🔍 Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '10px',
          marginBottom: '20px',
          color: '#ff6b6b'
        }}>
          {error}
        </div>
      )}

      {/* Results Section */}
      <div>
        {searchResults.length > 0 && (
          <p style={{ 
            marginBottom: '20px',
            color: 'var(--galaxy-text-secondary, #cccccc)',
            fontSize: '0.9rem'
          }}>
            Found {searchResults.length} results
          </p>
        )}
        
        {searchResults.map((track) => (
          <div key={track.id} style={{
            border: '1px solid var(--galaxy-border, #333)',
            backgroundColor: 'var(--galaxy-surface, #1a1a1a)',
            padding: '20px',
            margin: '15px 0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary, #1DB954)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--galaxy-border, #333)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <img 
              src={track.album.images[2]?.url || track.album.images[0]?.url || ''} 
              alt={track.name}
              style={{ 
                width: '80px', 
                height: '80px', 
                marginRight: '20px',
                borderRadius: '8px',
                border: '1px solid var(--galaxy-border, #333)'
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 8px 0',
                color: 'var(--galaxy-text-primary, #ffffff)',
                fontSize: '1.2rem',
                fontFamily: 'var(--font-heading, Arial, sans-serif)'
              }}>
                {track.name}
              </h3>
              <p style={{ 
                margin: '4px 0',
                color: 'var(--galaxy-text-secondary, #cccccc)',
                fontSize: '0.9rem'
              }}>
                <strong>Artist:</strong> {track.artists.map(artist => artist.name).join(', ')}
              </p>
              <p style={{ 
                margin: '4px 0',
                color: 'var(--galaxy-text-secondary, #cccccc)',
                fontSize: '0.9rem'
              }}>
                <strong>Album:</strong> {track.album.name}
              </p>
              <p style={{ 
                margin: '4px 0 12px 0',
                color: 'var(--galaxy-text-secondary, #cccccc)',
                fontSize: '0.9rem'
              }}>
                <strong>Duration:</strong> {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
              </p>
              <a 
                href={track.external_urls.spotify} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#1DB954',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-primary, Arial, sans-serif)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#1ed760';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#1DB954';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🎵 Open in Spotify
              </a>
            </div>
          </div>
        ))}
        
        {/* No results message */}
        {searchQuery && searchResults.length === 0 && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: 'var(--galaxy-text-secondary, #cccccc)'
          }}>
            <h3 style={{ marginBottom: '10px' }}>No results found</h3>
            <p>Try searching for different keywords like artist names, song titles, or album names</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPage;
