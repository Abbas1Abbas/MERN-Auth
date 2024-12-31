import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header.jsx';
import HomePage from './Components/Homepage.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';

const UserContext = createContext();

const App = () => {

  useEffect(() => {
    let defaultTheme = localStorage.getItem('theme');
    if(defaultTheme){
      setTheme(defaultTheme);
    }
  }, [])
  

  const [theme, setTheme] = useState('light');

  return (
    <UserContext.Provider value={{ theme, setTheme }}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
    </UserContext.Provider>
  );
};

export { UserContext };
export default App;