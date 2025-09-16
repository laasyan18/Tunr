import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  background-color: var(--background-primary);
  min-height: 100vh;
  font-family: var(--font-primary);
  line-height: 1.58;
  color: var(--text-secondary);
`;

const HeroSection = styled.section`
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl) var(--spacing-2xl);
  text-align: left;
`;

const HeroTitle = styled.h1`
  font-size: 3.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.75rem 0;
  font-family: var(--font-primary);
  letter-spacing: -0.022em;
  line-height: 1.04;
`;

const HeroSubtitle = styled.p`
  font-size: 1.313rem;
  color: var(--text-tertiary);
  margin: 0 0 var(--spacing-xl) 0;
  font-weight: 400;
  line-height: 1.58;
`;

const CTAButton = styled.button`
  background: var(--accent-gradient);
  color: var(--background-primary);
  border: none;
  padding: 0.75rem var(--spacing-lg);
  font-size: 1rem;
  font-weight: 400;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-primary);
  
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const FeaturesSection = styled.section`
  background-color: var(--background-surface);
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-top: 1px solid var(--border-primary);
`;

const FeaturesContainer = styled.div`
  max-width: var(--max-width-content);
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2xl) 0;
  font-family: var(--font-primary);
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const FeatureItem = styled.div`
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--border-primary);
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.313rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
`;

const FeatureDescription = styled.p`
  font-size: 1.125rem;
  color: var(--text-tertiary);
  margin: 0;
  line-height: 1.58;
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
