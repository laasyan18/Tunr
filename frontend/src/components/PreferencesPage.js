import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PreferencesContainer = styled.div`
  min-height: 100vh;
  background: var(--background-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  font-family: var(--font-primary);
`;

const PreferencesCard = styled.div`
  background: var(--background-primary);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-primary);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const ProgressText = styled.p`
  color: var(--text-tertiary);
  font-size: 0.75rem;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;

const Title = styled.h1`
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 2.25rem;
  font-weight: 700;
  font-family: var(--font-heading);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: 1.125rem;
  font-family: var(--font-heading);
`;

const SectionLabel = styled.h3`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.125rem;
  font-weight: 600;
  text-align: left;
  font-family: var(--font-heading);
`;

const SelectedCount = styled.p`
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-md);
  text-align: left;
  font-family: var(--font-heading);
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: var(--spacing-lg);
`;

const GenreButton = styled.button`
  padding: 0.75rem var(--spacing-md);
  border: 1px solid ${props => props.selected ? 'var(--accent-primary)' : 'var(--border-primary)'};
  background: ${props => props.selected ? 'var(--accent-gradient)' : 'var(--background-primary)'};
  color: ${props => props.selected ? 'var(--background-primary)' : 'var(--text-secondary)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-family: var(--font-primary);
  
  &:hover {
    border-color: var(--accent-primary);
    background: ${props => props.selected ? 'var(--accent-primary)' : 'var(--background-accent)'};
    transform: translateY(-1px);
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 0.875rem var(--spacing-lg);
  background: var(--accent-gradient);
  color: var(--background-primary);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: var(--spacing-md);
  font-family: var(--font-primary);
  
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  
  &:disabled {
    background: var(--text-tertiary);
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
`;

const SkipButton = styled.button`
  width: 100%;
  padding: 0.75rem var(--spacing-lg);
  background: transparent;
  color: var(--text-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: var(--spacing-sm);
  transition: all 0.2s ease;
  font-family: var(--font-primary);
  
  &:hover {
    color: var(--text-secondary);
    border-color: var(--text-secondary);
    background: var(--background-accent);
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
