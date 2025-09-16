import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';


const LoginContainer = styled.div`
  min-height: 100vh;
  background: var(--background-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  font-family: var(--font-primary);
`;

const LoginCard = styled.div`
  background: var(--background-primary);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-primary);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 2.25rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background: var(--background-primary);
  color: var(--text-primary);
  font-family: var(--font-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 1px var(--accent-primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem var(--spacing-lg);
  background: var(--accent-gradient);
  color: var(--background-primary);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: var(--spacing-sm);
  font-family: var(--font-primary);
  
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
      username, password
    });
    
    // Save authentication data
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', response.data.user.username);
    
    setMessage(`Welcome back, ${response.data.user.username}! 🎵🎬`);
    
    // Redirect to intended page or home
    const from = location.state?.from?.pathname || '/home';
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1000); // Small delay to show welcome message
    
  } catch (error) {
    if (error.response?.status === 401) {
      setMessage('Invalid username or password. Please try again.');
    } else if (error.response?.status === 400) {
      setMessage('Please check your credentials and try again.');
    } else {
      setMessage('Login failed. Please check your internet connection.');
    }
  }
};




  return (
    <LoginContainer>
      <LoginCard>
        <Title>Tunr</Title>
        <Subtitle>Your Movie & Music Discovery Platform</Subtitle>
        
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        
        {message && (
          <p style={{
            color: message.includes('Welcome') ? 'var(--accent-primary)' : 'var(--text-secondary)', 
            marginTop: 'var(--spacing-md)'
          }}>
            {message}
          </p>
        )}
        
        <Link to="/signup" style={{textDecoration: 'none', color: 'var(--accent-primary)'}}>
          New to Tunr? Create account
        </Link>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
