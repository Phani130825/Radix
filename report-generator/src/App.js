import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/App.css";
import ContactForm from "./components/ContactForm";
import UserManual from "./pages/UserManual";
import ResultsPage from "./pages/ResultsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    
    <Routes>
      
      <Route exact path="/" element={<Home />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/usermanual" element={<UserManual />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};

export default App;

