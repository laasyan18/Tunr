import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  background-color: var(--background-primary);
  min-height: 100vh;
  font-family: var(--font-primary);
  line-height: 1.58;
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
`;

const FormContainer = styled.div`
  background-color: var(--background-surface);
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
  font-family: var(--font-primary);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: 1rem;
  line-height: 1.58;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  text-align: left;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 400;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem var(--spacing-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background: var(--background-primary);
  color: var(--text-primary);
  font-family: var(--font-primary);
  transition: all 0.2s ease;
  
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
  border-radius: var(--border-radius-full);
  font-size: 1rem;
  cursor: pointer;
  font-family: var(--font-primary);
  transition: all 0.2s ease;
  margin-top: var(--spacing-sm);
  font-weight: 400;
  
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

const Error = styled.div`
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: var(--spacing-md);
`;

const SignupText = styled.p`
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: var(--spacing-lg);
`;

const StyledLink = styled(Link)`
  color: var(--accent-primary);
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const signupRes = await axios.post('http://127.0.0.1:8000/api/auth/signup/', {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      });

      if (signupRes?.data?.token) {
        localStorage.setItem('token', signupRes.data.token);
        localStorage.setItem('user', JSON.stringify(signupRes.data.user || { username: form.username, email: form.email }));
        navigate('/home', { replace: true });
        return;
      }

      const loginRes = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username: form.username.trim(),
        password: form.password
      });

      if (loginRes?.data?.token) {
        localStorage.setItem('token', loginRes.data.token);
        localStorage.setItem('user', JSON.stringify(loginRes.data.user || { username: form.username, email: form.email }));
        navigate('/home', { replace: true });
      } else {
        setError('Signup succeeded but login failed. Please sign in manually.');
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.error || resp?.detail) setError(resp.error || resp.detail);
      else if (resp?.username) setError('Username already exists.');
      else if (resp?.email) setError('Email already registered.');
      else setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Join Tunr</Title>
        <Subtitle>Create your account to discover amazing movies and music</Subtitle>
        
        {error && <Error>{error}</Error>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>
        
        <SignupText>
          Already have an account? <StyledLink to="/login">Sign in</StyledLink>
        </SignupText>
      </FormContainer>
    </Container>
  );
}
