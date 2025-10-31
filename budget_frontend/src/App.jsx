import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, [token]);

  const handleLogin = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Token ${tokenData}`;
  };

  const handleRegister = (tokenData, userData) => {
    // Same as login - auto-login after registration
    handleLogin(tokenData, userData);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout/`);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Show Login or Register page if not authenticated
  if (!token) {
    if (showRegister) {
      return (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
          apiUrl={API_URL}
        />
      );
    } else {
      return (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => setShowRegister(true)}
          apiUrl={API_URL}
        />
      );
    }
  }

  // Main App (after login)
  return (
    <div>
      <div className="header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>💰 Budget Tracker</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #f5f7fa', marginBottom: '20px' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '5px 5px 0 0' }}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '5px 5px 0 0' }}
            >
              Transactions
            </button>
            <button 
              onClick={() => setActiveTab('budget')}
              className={`btn ${activeTab === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '5px 5px 0 0' }}
            >
              Budget
            </button>
          </div>

          {activeTab === 'dashboard' && <Dashboard apiUrl={API_URL} />}
          {activeTab === 'transactions' && (
            <>
              <TransactionForm apiUrl={API_URL} />
              <TransactionList apiUrl={API_URL} />
            </>
          )}
          {activeTab === 'budget' && <BudgetManager apiUrl={API_URL} />}
        </div>
      </div>
    </div>
  );
}

export default App;