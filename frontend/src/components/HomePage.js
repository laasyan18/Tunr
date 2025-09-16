// HomePage.js - Main hub with search functionality
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--text-primary);
`;

const WelcomeTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 3rem;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
`;

const SearchButton = styled.button`
  padding: var(--spacing-xl) var(--spacing-3xl);
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-2xl);
  margin-top: var(--spacing-3xl);
`;

const FeatureCard = styled.div`
  background: var(--background-surface);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-large);
  text-align: center;
`;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <WelcomeTitle>Welcome to Tunr</WelcomeTitle>
      <p style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-2xl)' }}>
        Discover, rate, and review your favorite movies and music
      </p>
      
      <SearchButton onClick={() => navigate('/search')}>
        🔍 Start Searching Movies
      </SearchButton>
      
      <FeaturesGrid>
        <FeatureCard>
          <h3>🎬 Discover Movies</h3>
          <p>Search through thousands of movies and find your next favorite</p>
        </FeatureCard>
        <FeatureCard>
          <h3>⭐ Rate & Review</h3>
          <p>Share your thoughts and rate movies to help other users</p>
        </FeatureCard>
        <FeatureCard>
          <h3>📝 Keep Track</h3>
          <p>Mark movies as watched, create watchlists, and organize your collection</p>
        </FeatureCard>
      </FeaturesGrid>
    </Container>
  );
};

export default HomePage;
