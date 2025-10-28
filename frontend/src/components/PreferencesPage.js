import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PreferencesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--galaxy-bg) 0%, #0a1942 50%, #081838 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  font-family: var(--font-primary);
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
`;

const PreferencesCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  padding: var(--spacing-3xl);
  border-radius: var(--border-radius-large);
  border: 1px solid rgba(102, 126, 234, 0.3);
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProgressText = styled.p`
  color: var(--galaxy-text-secondary);
  font-size: 0.8rem;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 500;
`;

const Title = styled.h1`
  background: linear-gradient(135deg, #ffffff 0%, #e8ecf4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-md);
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-primary);
  letter-spacing: -0.022em;
`;

const Subtitle = styled.p`
  color: var(--galaxy-text-secondary);
  margin-bottom: var(--spacing-2xl);
  font-size: 1.125rem;
  line-height: 1.6;
`;

const SectionLabel = styled.h3`
  color: var(--galaxy-text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
  font-weight: 600;
  text-align: left;
  font-family: var(--font-primary);
`;

const SelectedCount = styled.p`
  color: var(--galaxy-text-secondary);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-lg);
  text-align: left;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
`;

const GenreButton = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid ${props => props.selected ? 'transparent' : 'rgba(102, 126, 234, 0.3)'};
  background: ${props => props.selected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.selected ? 'white' : 'var(--galaxy-text-primary)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-family: var(--font-primary);
  font-weight: 500;
  
  &:hover {
    border-color: transparent;
    background: var(--accent-gradient);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 1rem var(--spacing-xl);
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-full);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: var(--spacing-lg);
  font-family: var(--font-primary);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SkipButton = styled.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  background: transparent;
  color: var(--galaxy-text-secondary);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: var(--border-radius-full);
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: var(--spacing-md);
  transition: all 0.3s ease;
  font-family: var(--font-primary);
  
  &:hover {
    color: var(--galaxy-text-primary);
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali',
    'Korean', 'Japanese', 'Spanish', 'French', 'German', 'Italian',
    'Mandarin', 'Portuguese', 'Russian', 'Arabic'
  ];

  const toggleLanguage = (language) => {
    setSelectedLanguages(prev => 
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    );
  };

  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      // Save preferences to backend
      await axios.post('http://127.0.0.1:8000/api/auth/profile/', {
        preferred_languages: selectedLanguages.join(', ')
      });
      
      // Navigate to Welcome page instead of dashboard
      navigate('/welcome');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Even if save fails, continue to welcome page
      navigate('/welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/welcome');
  };

  return (
    <PreferencesContainer>

      <PreferencesCard>
        <ProgressText>Step 1 of 1 • Almost Done</ProgressText>
        <Title>Choose Your Languages</Title>
        <Subtitle>
          Select the languages you enjoy for movies and music. This helps us personalize your Tunr experience.
        </Subtitle>
        
        <SectionLabel>Preferred Languages</SectionLabel>
        <SelectedCount>
          {selectedLanguages.length > 0 ? 
            `${selectedLanguages.length} language${selectedLanguages.length !== 1 ? 's' : ''} selected` : 
            'Select languages you enjoy'
          }
        </SelectedCount>
        
        <GenreGrid>
          {languages.map(language => (
            <GenreButton
              key={language}
              selected={selectedLanguages.includes(language)}
              onClick={() => toggleLanguage(language)}
            >
              {language}
            </GenreButton>
          ))}
        </GenreGrid>

        <ContinueButton 
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? 'Saving preferences...' : 'Continue to Tunr'}
        </ContinueButton>
        
        <SkipButton 
          onClick={handleSkip}
          disabled={isLoading}
        >
          Skip for now
        </SkipButton>
      </PreferencesCard>
    </PreferencesContainer>
  );
};

export default PreferencesPage;
