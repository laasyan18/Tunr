import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TunrLogo from '../assets/Tunrl.png';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const Container = styled.div`
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  min-height: 100vh;
  font-family: var(--font-primary);
  line-height: 1.58;
  color: var(--galaxy-text-secondary);
  position: relative;
  overflow: hidden;
  
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
  
  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%);
    bottom: -200px;
    left: -200px;
    border-radius: 50%;
  }
`;

const HeroSection = styled.section`
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl) var(--spacing-2xl);
  text-align: left;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

const LogoImage = styled.img`
  width: 140px;
  height: auto;
  margin-bottom: var(--spacing-xl);
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3));
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--galaxy-text-primary);
  margin: 0 0 1.75rem 0;
  font-family: var(--font-primary);
  letter-spacing: -0.022em;
  line-height: 1.04;
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 1.313rem;
  color: var(--galaxy-text-secondary);
  margin: 0 0 var(--spacing-2xl) 0;
  font-weight: 400;
  line-height: 1.68;
  max-width: 580px;
`;

const CTAButton = styled.button`
  background: var(--accent-gradient);
  color: #ffffff;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.05rem;
  font-weight: 500;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
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
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FeaturesSection = styled.section`
  background: rgba(10, 36, 104, 0.4);
  backdrop-filter: blur(20px);
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-top: 1px solid rgba(102, 126, 234, 0.2);
  position: relative;
  z-index: 1;
`;

const FeaturesContainer = styled.div`
  max-width: var(--max-width-content);
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin: 0 0 var(--spacing-2xl) 0;
  font-family: var(--font-primary);
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
`;

const FeatureItem = styled.div`
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.2);
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
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--accent-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--galaxy-text-primary);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: var(--galaxy-text-secondary);
  margin: 0;
  line-height: 1.68;
`;

const StatsSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
  position: relative;
  z-index: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  text-align: center;
`;

const StatItem = styled.div`
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.15);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: var(--galaxy-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Track Movies & Music Together',
      description: 'Build your personal entertainment library combining films and songs.'
    },
    {
      title: 'Cross-Media Discoveries',
      description: 'Discover how your favorite movie soundtracks connect to new music.'
    },
    {
      title: 'Thoughtful Recommendations',
      description: 'Get personalized suggestions for both cinematic and musical tastes.'
    },
    {
      title: 'Community Connections',
      description: 'Join enthusiasts who appreciate both visual and auditory storytelling.'
    }
  ];

  return (
    <Container>
      <HeroSection>
        <LogoImage src={TunrLogo} alt="Tunr Logo" />
        <HeroTitle>Where Movies Meet Music</HeroTitle>
        <HeroSubtitle>
          Tunr connects cinema and sound. Track films and albums, discover soundtrack connections, 
          and explore how music shapes storytelling.
        </HeroSubtitle>
        <CTAButton onClick={() => navigate('/signup')}>Start Your Journey</CTAButton>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Built for Entertainment Enthusiasts</SectionTitle>
          <FeaturesList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureItem>
            ))}
          </FeaturesList>
        </FeaturesContainer>
      </FeaturesSection>
    </Container>
  );
};

export default Dashboard;
