// HomePage.js - Main hub with search functionality
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  color: var(--galaxy-text-primary);
  font-family: var(--font-primary);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
    top: -250px;
    right: -250px;
    border-radius: 50%;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1`
  font-family: var(--font-primary);
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.022em;
  line-height: 1.1;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--galaxy-text-secondary);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
`;

const SearchButton = styled.button`
  padding: var(--spacing-xl) var(--spacing-3xl);
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-full);
  font-family: var(--font-primary);
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
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
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-2xl);
  margin-top: var(--spacing-3xl);
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--accent-gradient);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(102, 126, 234, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
    color: var(--galaxy-text-primary);
  }
  
  p {
    color: var(--galaxy-text-secondary);
    line-height: 1.6;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <WelcomeTitle>Welcome to Tunr</WelcomeTitle>
        <WelcomeSubtitle>
          Discover, rate, and review your favorite movies and music
        </WelcomeSubtitle>
        
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
      </ContentWrapper>
    </Container>
  );
};

export default HomePage;
