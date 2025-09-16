// SearchPage.js - Fixed version
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchContainer = styled.div`
  background: var(--background-primary);
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-primary);
`;

const SearchForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1.125rem;
  border-radius: 12px;
  border: 2px solid var(--border-primary);
  background: var(--background-surface);
  color: var(--text-primary);
  font-family: var(--font-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(8, 31, 92, 0.1);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

// Custom search button - change this to whatever you want!
const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-50%) scale(1.3) rotate(10deg);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(-50%) scale(1.15);
  }
`;

const MagnifyIcon = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  
  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    top: 0;
    left: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 2px;
    background: white;
    border-radius: 1px;
    bottom: 0;
    right: 0;
    transform: rotate(45deg);
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MovieCard = styled.div`
  cursor: pointer;
  font-family: var(--font-primary);
  text-align: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const MovieTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const MovieYear = styled.div`
  font-size: 0.7rem;
  color: var(--text-secondary);
`;

const LoadingText = styled.p`
  text-align: center;
  color: var(--text-tertiary);
  font-family: var(--font-primary);
  margin: 2rem 0;
`;

axios.interceptors.request.use(request => {
    console.log('🚀 Starting Request', JSON.stringify({
        url: request.url,
        method: request.method,
        headers: request.headers,
        data: request.data
    }, null, 2));
    return request;
});

axios.interceptors.response.use(
    response => {
        console.log('✅ Response Success:', JSON.stringify({
            url: response.config.url,
            status: response.status,
            data: response.data
        }, null, 2));
        return response;
    },
    error => {
        console.error('❌ Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if user has searched

  // Get search query from URL params on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [location.search]);

  const handleSearch = async (queryToSearch) => {
    const actualQuery = queryToSearch || searchQuery;
    
    if (!actualQuery || actualQuery.length < 2) {
      setMovies([]);
      return;
    }

    setLoading(true);
    setHasSearched(true); // Mark that user has searched
    
    try {
      // Change this line (around line 113)
      const response = await axios.get(`http://127.0.0.1:8000/api/movies/search/?query=${encodeURIComponent(actualQuery.trim())}`);
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Search failed:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <>
      <SearchContainer>
        <SearchForm onSubmit={handleSubmit}>
          <SearchInput
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            spellCheck={false}
          />
          {/* Custom search button - change the text/icon to whatever you want */}
          <SearchButton type="submit">
            <MagnifyIcon />
            </SearchButton>
        </SearchForm>
      </SearchContainer>

      {loading && <LoadingText>Searching...</LoadingText>}

      <MoviesGrid>
        {movies.map((movie) => (
          <MovieCard 
            key={movie.imdbID} 
            onClick={() => {
              console.log('Clicking movie:', movie.imdbID);
              navigate(`/movie/${movie.imdbID}`);
            }}
          >
            <MoviePoster
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.png'}
              alt={movie.Title}
            />
            <MovieTitle>
              {movie.Title.length > 16 ? movie.Title.slice(0, 16) + '...' : movie.Title}
            </MovieTitle>
            <MovieYear>{movie.Year}</MovieYear>
          </MovieCard>
        ))}
      </MoviesGrid>

      {/* Only show "No movies found" AFTER user has searched */}
      {hasSearched && searchQuery.length >= 2 && movies.length === 0 && !loading && (
        <LoadingText>No movies found for "{searchQuery}". Try a different search term.</LoadingText>
      )}

      {!hasSearched && (
        <LoadingText>Enter a movie title above to start searching</LoadingText>
      )}

    
    </>
  );
};

export default SearchPage;
