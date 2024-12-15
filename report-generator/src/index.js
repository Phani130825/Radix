import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/Navbar.css"
import "./styles/Footer.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar/>    
      <App />
      <Footer/>
    </BrowserRouter>
  </React.StrictMode>
);

