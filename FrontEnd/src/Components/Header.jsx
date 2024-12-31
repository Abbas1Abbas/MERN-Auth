import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App.jsx';
import axios from 'axios'

const Header = () => {
  const { theme, setTheme } = useContext(UserContext);

  const handleLogout = async() => {
    try{
      const res = await axios.post('http://localhost:3000/auth/logout',{},{withCredentials:true});
      console.log(res.data)
    }catch(error){
      console.log(error);
    }
  }

  const saveTheme = (theme) => {
    if(theme === "light"){ localStorage.setItem('theme', "dark");}
    else{ localStorage.setItem('theme', "light");}
  }

  return (
    <header style={{ width: '100%',borderBottom: theme === "light" ? "2px solid #222" : "1px solid #FBFBFB",}}>
      <nav style={{backgroundColor: theme === 'light' ? 'rgb(232, 232, 232)' : '#222',color: theme === 'light' ? '#222' : '#FBFBFB',}}>
        <div id="logo">authMern</div>
        <div id="iconDiv">
            <Link className='linkTag' to="/" style={{color: theme === 'light' ? '#FBFBFB' : '#222',textDecoration: 'none',}}><button style={{backgroundColor: theme === 'light' ? '#222' : '#fff',color: theme === 'light' ? '#FBFBFB' : '#222',}} >Home</button></Link>
            <Link className='linkTag' to="/login" style={{color: theme === 'light' ? '#FBFBFB' : '#222',textDecoration: 'none',}}><button style={{backgroundColor: theme === 'light' ? '#222' : '#fff',color: theme === 'light' ? '#FBFBFB' : '#222',}} >Login</button></Link>
            <button onClick={handleLogout} style={{backgroundColor: theme === 'light' ? '#222' : '#fff',color: theme === 'light' ? '#FBFBFB' : '#222',}} >Logout</button>
            <button  style={{backgroundColor: theme === 'light' ? '#222' : '#fff',color: theme === 'light' ? '#FBFBFB' : '#222',}}  onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light');
              saveTheme(theme);
            }}>{theme}</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;