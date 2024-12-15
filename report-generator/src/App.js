import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/App.css";

const App = () => {
  return (
    
    <Routes>
      
      <Route exact path="/" element={<Home />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
};

export default App;

