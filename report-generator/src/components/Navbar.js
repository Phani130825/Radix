import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Radix_</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

