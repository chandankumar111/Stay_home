import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '2px solid #4CAF50', borderRadius: '10px', backgroundColor: '#f9fff9', boxShadow: '0 0 10px #4CAF50' }}>
      <h2 style={{ textAlign: 'center' }}>🔐 Login</h2>
      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#4CAF50', fontWeight: 'bold', textDecoration: 'none' }}>
          Sign Up 🎉
        </Link>
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img src="/images/login-emoji.png" alt="Login Emoji" style={{ width: '80px', height: '80px' }} />
      </div>
    </div>
  );
};

export default Login;
