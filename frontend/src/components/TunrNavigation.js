// TunrNavigation.js - Minimal navigation with search ICON only
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../assets/Tunrl.png';

const NavBar = styled.nav`
  background: var(--galaxy-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 56px;
  border-bottom: 1px solid var(--galaxy-border);
  font-family: var(--font-primary);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-right: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-left: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: var(--galaxy-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-heading);
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: var(--galaxy-text-secondary);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: var(--border-radius);
  
  &:hover {
    color: var(--accent-primary);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: var(--milky-way);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: var(--font-heading);
  
  &:hover {
    opacity: 0.9;
  }
`;
const LogoutButton = styled.button`
  background: none;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-family: var(--font-primary);
  
  &:hover {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
  }
`;

const TunrNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Redirect to dashboard
    navigate('/');
  };

  return (
    <NavBar>
      <LeftSection>
        <Logo 
          src={LogoImage} 
          alt="Tunr Logo" 
          onClick={() => navigate('/search')}
        />
        
        <NavLinks>
          <NavLink onClick={() => navigate('/movies')}>MOVIES</NavLink>
          <NavLink onClick={() => navigate('/music')}>MUSIC</NavLink>
          <NavLink onClick={() => navigate('/collections')}>COLLECTIONS</NavLink>
          <NavLink onClick={() => navigate('/community')}>COMMUNITY</NavLink>
          <NavLink onClick={() => navigate('/stories')}>STORIES</NavLink>
        </NavLinks>
      </LeftSection>

      <RightSection>
        <SearchButton onClick={() => navigate('/search')}>🔍</SearchButton>
        <UserAvatar onClick={() => navigate('/profile')}>U</UserAvatar>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </RightSection>
    </NavBar>
  );
};

export default TunrNavigation;
