import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupContainer = styled.div`
  min-height: 100vh;
  background: var(--background-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  font-family: var(--font-primary);
`;

const SignupCard = styled.div`
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  font-family: var(--font-primary);
  transition: all 0.2s ease;
  margin-top: var(--spacing-sm);
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Create account
      const signupResponse = await axios.post('http://127.0.0.1:8000/api/auth/signup/', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      
      console.log('Signup successful:', signupResponse.data);
      
      // If signup successful, try to auto-login
      if (signupResponse.status === 201) {
        try {
          const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username: formData.username,
            password: formData.password
          });
          
          // Save authentication data
          localStorage.setItem('authToken', loginResponse.data.token);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', loginResponse.data.user.username);
          
          setMessage(`Welcome to Tunr, ${loginResponse.data.user.username}! 🎉`);
          
          // Redirect to welcome page
          setTimeout(() => {
            navigate('/welcome');
          }, 1500);
          
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          setMessage('Account created successfully! Please login.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.username) {
          setMessage('Username already exists. Please choose a different one.');
        } else if (errorData.email) {
          setMessage('Email already registered. Please use a different email.');
        } else {
          setMessage('Invalid data. Please check your information.');
        }
      } else if (error.response?.status === 409) {
        setMessage('User already exists. Please try logging in.');
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <Title>Join Tunr</Title>
        <Subtitle>Create your account to discover amazing movies and music</Subtitle>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        {message && (
          <p style={{
            color: message.includes('Welcome') ? 'var(--accent-primary)' : 'var(--text-secondary)', 
            marginTop: 'var(--spacing-md)',
            fontSize: '0.9rem'
          }}>
            {message}
          </p>
        )}
        
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <Link to="/login" style={{
            color: 'var(--accent-primary)', 
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            Already have an account? Sign in
          </Link>
        </div>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage;
