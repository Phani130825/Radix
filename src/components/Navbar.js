// import React from "react";
// import { Link } from "react-router-dom";
// import "./../styles/Navbar.css";

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <span className="chest">Rad</span>
//         <span className="xpert">iX_</span>
//       </div>
//       <ul className="nav-links">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/results">Results</Link></li>
//         <li><Link to="/about">About Us</Link></li>
//         <li><Link to="/usermanual">User Manual</Link></li>
//         <li><Link to="/contact">Contact Us</Link></li>
//       </ul>
//       <div className="try-now-btn">
//         <Link to="/SignUp">Try Now</Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Function to determine if the current link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/1000056406.png" alt="Description " />
        <span className="chest">RaD</span>
        <span className="xpert">ix_</span>
      </div>
      <ul className="nav-links">
        {!isLoggedIn ? (
          <>
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/results" className={isActive('/results')}>Results</Link></li>
            <li><Link to="/about" className={isActive('/about')}>About Us</Link></li>
            <li><Link to="/usermanual" className={isActive('/usermanual')}>User Manual</Link></li>
            <li><Link to="/contact" className={isActive('/contact')}>Contact Us</Link></li>
            <div className="try-now-btn">
              <Link to="/signup">Get Started</Link>
            </div>
          </>
        ) : (
          <>
            <li><Link to="/upload-data" className={isActive('/upload-data')}>Upload Data</Link></li>
            <li><Link to="/view-reports" className={isActive('/view-reports')}>View Reports</Link></li>
            <li><Link to="/contact" className={isActive('/contact')}>Contact Us</Link></li>
            <li><Link to="/usermanual" className={isActive('/usermanual')}>User Manual</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;



