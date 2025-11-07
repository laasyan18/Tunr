// TunrNavigation.js - Minimal navigation with profile dropdown
import React, { useState, useEffect, useRef } from 'react';
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
  position: relative;
`;

const ProfileContainer = styled.div`
  position: relative;
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

const ProfileIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.hasImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border: 2px solid ${props => props.hasImage ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    border-color: var(--accent-primary);
  }
`;

const DefaultProfileIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  
  /* Person silhouette using CSS */
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 6px;
    width: 18px;
    height: 12px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50% 50% 0 0;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileLetter = styled.span`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  font-family: var(--font-heading);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--galaxy-surface);
  border: 1px solid var(--galaxy-border);
  border-radius: var(--border-radius-large);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: none;
  border: none;
  color: var(--galaxy-text-primary);
  text-align: left;
  cursor: pointer;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: var(--accent-primary);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const MenuIcon = styled.span`
  font-size: 1.1rem;
`;

const TunrNavigation = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get username from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUsername(user.username || user.email?.split('@')[0] || 'U');
      } catch (e) {
        setUsername('U');
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to home
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <NavBar>
      <LeftSection>
        <Logo 
          src={LogoImage} 
          alt="Tunr Logo" 
          onClick={() => navigate('/feed')}
        />
        
        <NavLinks>
          <NavLink onClick={() => navigate('/search')}>MOVIES</NavLink>
          <NavLink onClick={() => navigate('/library')}>LIBRARY</NavLink>
          <NavLink onClick={() => navigate('/music')}>MUSIC</NavLink>
        </NavLinks>
      </LeftSection>

      <RightSection>
        <ProfileContainer ref={dropdownRef}>
          <ProfileIcon onClick={toggleDropdown}>
            <DefaultProfileIcon />
          </ProfileIcon>
          
          <DropdownMenu show={showDropdown}>
            <MenuItem onClick={() => { navigate('/profile'); setShowDropdown(false); }}>
              <MenuIcon>�</MenuIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/preferences'); setShowDropdown(false); }}>
              <MenuIcon>⚙️</MenuIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <MenuIcon>🚪</MenuIcon>
              Logout
            </MenuItem>
          </DropdownMenu>
        </ProfileContainer>
      </RightSection>
    </NavBar>
  );
};

export default TunrNavigation;
