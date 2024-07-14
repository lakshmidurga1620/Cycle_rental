import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const response = await axios.post(`http://localhost:8080${endpoint}`, { username, password });
      
      if (isLogin) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        setIsLogin(true);
        setError('Signup successful. Please log in.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <video autoPlay loop muted className="background-video">
          <source src={process.env.PUBLIC_URL + '/videos/cycling-video.mp4'} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="auth-right">
      <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="Logo" className="auth-logo" />
        <h2 className="branding">Cycle Rental Club</h2>
        <div className="auth-tile">
          <h2 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <button type="submit" className="auth-button">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          {error && <p className="auth-error">{error}</p>}
          <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </p>
        </div>
      </div>
    </div>
  );
}
export default Auth;

