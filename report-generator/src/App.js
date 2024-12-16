// import React from "react";
// import {BrowserRouter, Route, Routes} from 'react-router-dom'
// import Home from "./pages/Home";
// import Reports from "./pages/Reports";
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import "./styles/App.css";
// import ContactForm from "./components/ContactForm";
// import UserManual from "./pages/UserManual";
// import ResultsPage from "./pages/ResultsPage";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";

// const App = () => {
//   return (
    
//     <Routes>
      
//       <Route exact path="/" element={<Home />} />
//       <Route path="/reports" element={<Reports />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/contact" element={<ContactForm />} />
//       <Route path="/usermanual" element={<UserManual />} />
//       <Route path="/results" element={<ResultsPage />} />
//       <Route path="/SignUp" element={<SignUp />} />
//       <Route path="/Login" element={<Login />} />
//       <Route path="*" element={<NotFound />} />
      
//     </Routes>
//   );
// };

// export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import UserManual from "./pages/UserManual";
import ResultsPage from "./pages/ResultsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UploadData from "./pages/UploadData";
import ViewReports from "./pages/ViewReports";
import "./styles/App.css";


const App = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/usermanual" element={<UserManual />} />
      <Route path="/results" element={<ResultsPage />} />

      {/* Authentication Routes */}
      <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

      {/* Protected Routes */}
      {isLoggedIn && (
        <>
          <Route path="/upload-data" element={<UploadData />} />
          <Route path="/view-reports" element={<ViewReports />} />
        </>
      )}

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


export default App;


