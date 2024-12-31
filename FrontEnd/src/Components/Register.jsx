import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const { theme } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const formStyle = {
    color: theme === 'light' ? '#222' : '#FBFBFB',
    background: theme === 'light' ? 'rgba(255, 255, 255, 0.29)' : 'rgba(4, 3, 3, 0.29)',
    border: theme === 'light' ? '1px solid rgba(255, 255, 255, 0.49)' : '1px solid rgba(4, 3, 3, 0.49)',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, Email & Password are Required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/auth/register', {
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
        role: role.trim().toLowerCase() === "admin" ? "admin" : "user",
      }, { withCredentials: true });
      console.log(res.data);
    } catch (error) {
      setError('Error registering user, please try again.');
    }

    setEmail('');
    setName('');
    setPassword('');
    setRole('');
  };

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      try {
        const response = await axios.post('http://localhost:3000/auth/refresh-token', {}, { withCredentials: true });
        if (response.status === 200) {
          console.log('Access token refreshed:', response.data.accessToken);
        } else {
          console.error('Failed to refresh token:', response.data.message);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, 59 * 60 * 1000);
    return () => clearInterval(refreshTokenInterval);
  }, []);

  return (
    <div className='mainContentDiv'
      style={{
        height: theme === "light" ? "calc(100vh - 72px)" : "calc(100vh - 71px)",
        background: theme === "light" ? "#e5e5e5" : "#222"
      }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div className='formHdg'>Registration</div>
        {error && <p style={{fontSize: "12px", color: 'red' }}>{error}</p>}
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ color: theme === "light" ? "#222" : "#fff", background: theme === "light" ? "#ffffff55" : "#292929" }} placeholder='Name' type="text" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ color: theme === "light" ? "#222" : "#fff", background: theme === "light" ? "#ffffff55" : "#292929" }} placeholder='Email' type="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} style={{ color: theme === "light" ? "#222" : "#fff", background: theme === "light" ? "#ffffff55" : "#292929" }} placeholder='Password' type="text" />
        <input value={role} onChange={(e) => setRole(e.target.value)} style={{ color: theme === "light" ? "#222" : "#fff", background: theme === "light" ? "#ffffff55" : "#292929" }} placeholder='Role' type="text" />
        <button>REGISTER</button>
        <span><Link style={{ color: theme === "light" ? "#222" : "#fff" }} className='usefulLink' to='/login'>Login</Link></span>
      </form>
    </div>
  );
};

export default Register;
