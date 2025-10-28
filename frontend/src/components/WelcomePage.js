import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Full-screen cinematic container
const CinematicContainer = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--background-primary);
`;

// Cinematic background image with multiple fallbacks
const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1489599512685-268b27577a33?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  
  /* Fallback images if first doesn't load */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80');
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
`;

// Professional dark overlay
const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 35, 0.75) 0%,
    rgba(26, 31, 58, 0.65) 50%,
    rgba(36, 43, 74, 0.75) 100%
  );
  z-index: 1;
`;

// Central content card with glassmorphism
const ContentCard = styled.div`
  position: relative;
  z-index: 2;
  max-width: 600px;
  width: 90%;
  text-align: center;
  background: rgba(26, 31, 58, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 164, 255, 0.2);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-6xl) var(--spacing-4xl);
  box-shadow: var(--shadow-2xl);
  transition: var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-glow);
  }
`;

// Movie/Music icon placeholder
const MediaIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-4xl);
  background: rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-2xl);
  border: 2px solid var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transition: var(--transition-normal);
  
  &:hover {
    transform: scale(1.05);
    background: rgba(59, 130, 246, 0.3);
  }
`;

// Hero title
const HeroTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

// Hero subtitle
const HeroSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-6xl);
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

// Call-to-action button
const CTAButton = styled.button`
  font-family: var(--font-ui);
  font-size: 1.2rem;
  font-weight: 600;
  padding: var(--spacing-xl) var(--spacing-6xl);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-glow);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

// Bottom event information section
const EventSection = styled.div`
  position: absolute;
  bottom: var(--spacing-4xl);
  left: var(--spacing-4xl);
  right: var(--spacing-4xl);
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-xl);
    align-items: center;
    text-align: center;
    bottom: var(--spacing-2xl);
    left: var(--spacing-lg);
    right: var(--spacing-lg);
  }
`;

// Event information
const EventInfo = styled.div`
  background: rgba(26, 31, 58, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 164, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-2xl);
  
  h3 {
    font-family: var(--font-heading);
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin: 0;
    opacity: 0.8;
  }
`;

// Register button
const RegisterButton = styled.button`
  font-family: var(--font-ui);
  font-size: var(--text-base);
  font-weight: 500;
  padding: var(--spacing-lg) var(--spacing-2xl);
  background: transparent;
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: var(--accent-primary);
    color: var(--text-inverse);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <CinematicContainer>
      <BackgroundImage />
      <BackgroundOverlay />
      
      <ContentCard>
        <MediaIcon>
          🎬
        </MediaIcon>
        
        <HeroTitle>
          Exploring The Best of Film and Music
        </HeroTitle>
        
        <HeroSubtitle>
          Join TUNR to explore curated playlists and movie recommendations tailored just for you. Elevate your entertainment adventures with us!
        </HeroSubtitle>
        
        <CTAButton onClick={handleGetStarted}>
          Get Started Now
        </CTAButton>
      </ContentCard>
      
      <EventSection>
        <EventInfo>
          <h3>Cinematic Harmony Night</h3>
          <p>06 Nov 2025, 11:45 am - 1:45 pm</p>
          <p>TUNR Studio Theater, Los Angeles, CA 90012, USA</p>
        </EventInfo>
        
        <RegisterButton onClick={handleRegister}>
          Register Now
        </RegisterButton>
      </EventSection>
    </CinematicContainer>
  );
};

export default WelcomePage;
