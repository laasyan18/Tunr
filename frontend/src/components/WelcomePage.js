import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Main container with gradient background
const WelcomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--milky-way) 0%, var(--background-surface) 50%, var(--galaxy) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  font-family: var(--font-primary);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(8,31,92,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,249,240,0.1) 0%, transparent 50%);
  }
`;

// Central welcome card
const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 249, 240, 0.2);
  padding: var(--spacing-3xl);
  border-radius: 20px;
  text-align: center;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(8, 31, 92, 0.15);
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.8s ease-out;
`;

// Large animated title
const Title = styled.h1`
  color: var(--text-primary);
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  font-family: var(--font-heading);
  background: linear-gradient(135deg, var(--galaxy), var(--accent-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

// Elegant subtitle
const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.4rem;
  margin-bottom: var(--spacing-2xl);
  font-family: var(--font-heading);
  line-height: 1.6;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// Features grid with hover effects
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin: var(--spacing-3xl) 0;
`;

const FeatureCard = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  padding: var(--spacing-xl);
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.8s ease-out ${props => props.delay || '0.2s'} both;
  
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
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 15px 35px rgba(8, 31, 92, 0.2);
    border-color: var(--accent-primary);
    
    &::before {
      left: 100%;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const FeatureTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  font-family: var(--font-heading);
`;

const FeatureDescription = styled.p`
  color: var(--text-tertiary);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  font-family: var(--font-heading);
`;

// Stunning call-to-action button
const StartButton = styled.button`
  background: var(--accent-gradient);
  color: var(--milky-way);
  border: none;
  padding: var(--spacing-lg) var(--spacing-3xl);
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-primary);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(8, 31, 92, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(8, 31, 92, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

// Decorative elements
const DecorativeCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(8,31,92,0.1), rgba(255,249,240,0.1));
  animation: ${float} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 120px;
    height: 120px;
    top: 10%;
    right: 10%;
    animation-delay: -2s;
  }
  
  &:nth-child(2) {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 15%;
    animation-delay: -4s;
  }
  
  &:nth-child(3) {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 5%;
    animation-delay: -1s;
  }
`;

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartExploring = () => {
    navigate('/home');
  };

  return (
    <WelcomeContainer>
      <DecorativeCircle />
      <DecorativeCircle />
      <DecorativeCircle />
      
      <WelcomeCard>
        <Title>Welcome to Tunr! </Title>
        <Subtitle>
          Your personalized gateway to discovering the perfect harmony between cinema and music
        </Subtitle>
        
        <FeaturesGrid>
          <FeatureCard delay="0.2s">
            <FeatureIcon delay="0s">🎬</FeatureIcon>
            <FeatureTitle>Discover Movies</FeatureTitle>
            <FeatureDescription>
              Explore thousands of films from around the world with detailed information and reviews
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard delay="0.4s">
            <FeatureIcon delay="1s">🎵</FeatureIcon>
            <FeatureTitle>Connect with Music</FeatureTitle>
            <FeatureDescription>
              Find the perfect soundtracks and musical stories that enhance your viewing experience
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard delay="0.6s">
            <FeatureIcon delay="2s">📚</FeatureIcon>
            <FeatureTitle>Build Your Library</FeatureTitle>
            <FeatureDescription>
              Create your personal collection and share your discoveries with fellow enthusiasts
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
        
        <StartButton onClick={handleStartExploring}>
          Begin Your Journey ✨
        </StartButton>
      </WelcomeCard>
    </WelcomeContainer>
  );
};

export default WelcomePage;
