import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup"); // Navigate to the SignUp page
  };

  return (
    <section className="hero-section">
      <h1>Welcome to RaDix</h1>
      <p>Generate insightful reports with ease and efficiency.</p>
      <button className="cta-button" onClick={handleGetStarted}>
        Get Started
      </button>
    </section>
  );
};

export default HeroSection;

