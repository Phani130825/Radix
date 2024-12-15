import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="chest">Rad</span>
        <span className="xpert">iX_</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/results">Results</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/usermanual">User Manual</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
      <div className="try-now-btn">
        <Link to="/SignUp">Try Now</Link>
      </div>
    </nav>
  );
};

export default Navbar;


