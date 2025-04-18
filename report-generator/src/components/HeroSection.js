import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="main-title">
            <span className="highlight">Welcome to</span>
            <span className="brand">RaDix</span>
          </h1>
          <p className="subtitle">Advanced Healthcare Analytics Platform</p>
          <div className="feature-highlights">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Intelligent Report Generation</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔬</span>
              <span>Precision Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <span>Data-Driven Insights</span>
            </div>
          </div>
          <button className="cta-button" onClick={handleGetStarted}>
            <span className="button-text">Get Started</span>
            <span className="button-arrow">→</span>
          </button>
        </div>
        <div className="hero-decoration">
          <div className="pulse-circle"></div>
          <div className="health-symbols">
            <div className="symbol symbol-1">+</div>
            <div className="symbol symbol-2">❤</div>
            <div className="symbol symbol-3">⚕</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

