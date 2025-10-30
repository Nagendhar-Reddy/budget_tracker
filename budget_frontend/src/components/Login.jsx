import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, apiUrl }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/login/`, {
        username,
        password
      });
      
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          💰 Budget Tracker
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Login to manage your finances
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          background: '#f5f7fa', 
          borderRadius: '5px',
          fontSize: '13px'
        }}>
          <strong>Test Credentials:</strong><br />
          Username: testuser<br />
          Password: testpass123
        </div>
      </div>
    </div>
  );
}

export default Login;