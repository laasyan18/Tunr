// SearchPage.js - Fixed version
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SearchContainer = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  padding: var(--spacing-2xl) var(--spacing-xl);
  font-family: var(--font-primary);
  animation: ${fadeIn} 0.6s ease-out;
`;

const SearchHeader = styled.div`
  max-width: 800px;
  margin: 0 auto var(--spacing-3xl) auto;
  text-align: center;
  padding-top: var(--spacing-xl);
`;

const SearchTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.022em;
`;

const SearchForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.125rem 3.5rem 1.125rem 1.5rem;
  font-size: 1.125rem;
  border-radius: var(--border-radius-full);
  border: 2px solid rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  color: var(--galaxy-text-primary);
  font-family: var(--font-primary);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.6);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: var(--galaxy-text-secondary);
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
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
`;

const MovieCard = styled.div`
  cursor: pointer;
  font-family: var(--font-primary);
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-md);
  border: 1px solid rgba(102, 126, 234, 0.15);
  
  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
`;

const MovieTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--spacing-xs);
`;

const MovieYear = styled.div`
  font-size: 0.8rem;
  color: var(--galaxy-text-secondary);
`;

const LoadingText = styled.p`
  text-align: center;
  color: var(--galaxy-text-secondary);
  font-family: var(--font-primary);
  margin: 3rem 0;
  font-size: 1.125rem;
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
      const response = await axios.get(`${API_URL}/api/movies/search/?query=${encodeURIComponent(actualQuery.trim())}`);
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
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>🎬 Discover Movies</SearchTitle>
      </SearchHeader>
      
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          spellCheck={false}
        />
        <SearchButton type="submit">
          <MagnifyIcon />
        </SearchButton>
      </SearchForm>

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
              {movie.Title.length > 20 ? movie.Title.slice(0, 20) + '...' : movie.Title}
            </MovieTitle>
            <MovieYear>{movie.Year}</MovieYear>
          </MovieCard>
        ))}
      </MoviesGrid>

      {hasSearched && searchQuery.length >= 2 && movies.length === 0 && !loading && (
        <LoadingText>No movies found for "{searchQuery}". Try a different search term.</LoadingText>
      )}

      {!hasSearched && (
        <LoadingText>Enter a movie title above to start searching</LoadingText>
      )}
    </SearchContainer>
  );
};

export default SearchPage;
