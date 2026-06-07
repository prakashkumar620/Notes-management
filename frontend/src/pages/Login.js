import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  perspective: 1200px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    top: -100px;
    right: -100px;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    bottom: -50px;
    left: -50px;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    50% {
      transform: translateY(30px) translateX(20px);
    }
  }
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 420px;
  width: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transform: translateZ(100px);
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.5;
  }

  @keyframes popIn {
    0% {
      opacity: 0;
      transform: translateZ(100px) scale(0.5) rotateX(90deg);
    }
    100% {
      opacity: 1;
      transform: translateZ(100px) scale(1) rotateX(0deg);
    }
  }
`;

const Title = styled.h1`
  color: #667eea;
  margin-bottom: 10px;
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: ${props => (props.show ? 'block' : 'none')};
  border-left: 4px solid #d32f2f;
  animation: slideIn 0.3s ease;
  font-weight: 500;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const GoogleButtonWrapper = styled.div`
  margin-top: 20px;
  perspective: 1000px;

  .google-button {
    transform: translateZ(15px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .google-button:hover {
    transform: translateZ(25px) scale(1.05);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4) !important;
  }

  .google-button:active {
    transform: translateZ(10px) scale(0.98);
  }

  /* Style the Google button */
  div > div:first-child {
    transform: translateZ(10px);
  }
`;

const Divider = styled.div`
  margin: 25px 0 20px 0;
  display: flex;
  align-items: center;
  color: #999;
  font-size: 12px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #ddd, transparent);
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const FeatureList = styled.div`
  margin-top: 25px;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #666;
  transform: translateZ(8px);
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
  animation-delay: ${props => props.delay || '0s'};

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateZ(8px) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateZ(8px) translateY(0);
    }
  }

  &::before {
    content: '✓';
    color: #667eea;
    font-weight: bold;
  }
`;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setError('');
      const success = await login(credentialResponse.credential);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  const handleLoginError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>📚 Study Stack</Title>
        <Subtitle>Prakash Study Stack - Role-Based Notes Management</Subtitle>
        <ErrorMessage show={!!error}>{error}</ErrorMessage>
        
        <GoogleButtonWrapper>
          <div className="google-button">
            <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
          </div>
        </GoogleButtonWrapper>

        <Divider>Login with Google</Divider>

        <FeatureList>
          <FeatureItem delay="0.1s">Upload and share study materials</FeatureItem>
          <FeatureItem delay="0.2s">Download notes with PDF support</FeatureItem>
          <FeatureItem delay="0.3s">Role-based access control</FeatureItem>
          <FeatureItem delay="0.4s">Secure file management</FeatureItem>
        </FeatureList>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
