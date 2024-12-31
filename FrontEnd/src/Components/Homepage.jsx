import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App.jsx';
import axios from 'axios';

const Homepage = () => {
    const { theme } = useContext(UserContext);
    const [data, setData] = useState([]);


    useEffect(() => {
        setTimeout(async () => {
            try {
                const res = await axios.get('http://localhost:3000/auth/protected', {withCredentials: true,});
                setData(res.data.message);
            } catch (error) {
                console.error('Error fetching protected route:', error.response?.data || error.message);
            }
        }, 10);
    }, []);
    

    return (
        <div
            className='homePage mainContentDiv'
            style={{
                background: theme === "light" ? "#e5e5e5" : "#222222",
                height: theme === "light" ? "calc(100vh - 72px)" : "calc(100vh - 71px)"
            }}
        >
            <div className='homePageHdg' style={{color: theme === "light" ? "#222" : "#FBFBFB",}}>
                {typeof data != "string" ? "Welcome User" : data}
            </div>
            <div style={{color: theme === "light" ? "#222" : "#FBFBFB",}}  className='homePageDesc'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto consequatur exercitationem quia, eaque tenetur accusantium repellat aut sapiente reiciendis quae.</div>
        </div>
    );
};

export default Homepage;
