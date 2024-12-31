import React, { useContext, useState, useEffect } from 'react'; // <-- Add useEffect here
import { UserContext } from '../App.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const { theme } = useContext(UserContext);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      const refreshTokenInterval = setInterval(async () => {
        try {
          const response = await axios.post('http://localhost:3000/auth/refresh-token', {}, { withCredentials: true });
          console.log(response.data);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 59 * 60 * 1000);
      return () => clearInterval(refreshTokenInterval);
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email || !password) {
        setError("Email and Password are required.");
        return; // Prevent form submission if fields are empty
      }
      try {
        const res = await axios.post('http://localhost:3000/auth/login', {
          email: email.trim(),
          password: password.trim(),
        }, { withCredentials: true });
        console.log(res.data);
      } catch (error) {
        setError(error.response.data.message);
        console.error(error);
      }
    };

    return (
      <div className='mainContentDiv'
        style={{ height: theme === "light" ? "calc(100vh - 72px)" : "calc(100vh - 71px)", background: theme === "light" ? "#e5e5e5" : "#222" }}
      >
        <form onSubmit={handleSubmit} style={{
          color: theme === "light" ? "#222" : "#FBFBFB",
          background: theme === "light" ? "rgba(255, 255, 255, 0.29)" : "rgba(4, 3, 3, 0.29)",
          border: theme === "light" ? "1px solid rgba(255, 255, 255, 0.49)" : "1px solid rgba(4, 3, 3, 0.49)",
        }}>
          <div className='formHdg'>Login Form</div>
          <div style={{ color: "red", fontSize: "12px" }}>{error}</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{
            color: theme === "light" ? "#222" : "#fff",
            background: theme === "light" ? "#ffffff55" : "#292929"
          }} placeholder='Email' type="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} style={{
            color: theme === "light" ? "#222" : "#fff",
            background: theme === "light" ? "#ffffff55" : "#292929"
          }} placeholder='Password' type="text" />
          <button>LOGIN</button>
          <span><Link style={{ color: theme === "light" ? "#222" : "#fff" }} className='usefulLink' to='/register'>Register</Link></span>
        </form>
      </div>
    );
};

export default Login;
