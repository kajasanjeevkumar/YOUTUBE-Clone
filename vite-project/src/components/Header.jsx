import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom";
import AuthContext from "./context/authContext";
import './style.css';
import logo from "./images/logo.png";

function Header({onSearch}) {
  const [query,setQuery]=useState("");
  const { user, logout } = useContext(AuthContext);
  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Send search query to App.jsx
  };
  return (
    <div>
      <header className='header'>
        <div className='logo'>
            <img src={logo} alt="logo" height='40px' width='40px'/>
            <div className="logo-name">YOUTUBE<sup>IN</sup></div>
        </div>
        <input type="text" placeholder='Search' className='search-bar' value={query}
        onChange={handleSearch} />

        {user ? (
                <div className="btns">
                <Link className='sign-in' to="/profile">Channel</Link>
                <button className="sign-in" onClick={logout}>Logout</button>
              </div>
                
            ) : (
                <>
                    <div className="btns">
                      <Link className='sign-in' to="/login">Login</Link>
                      <Link className='sign-in' to="/signup">Signup</Link>
                    </div>
                   
                </>
            )}
      </header>

    </div>
  )
}

export default Header
