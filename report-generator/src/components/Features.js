import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./../styles/Features.css";

const Features = () => {
  return (
    <section className="features">
      <h2>Features</h2>
      <div className="feature-list">
        <div className="feature-item auto-reports">
          <div className="feature-content">
            <h3>Auto-Generated Reports</h3>
            <p>Generate comprehensive reports automatically with minimal effort.</p>
          </div>
          <div className="feature-animation">
            <DotLottieReact
              src="/auto-report.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        <div className="feature-item image-analysis">
          <div className="feature-content">
            <h3>Image Analysis</h3>
            <p>Analyze satellite images to extract valuable insights.</p>
          </div>
          <div className="feature-animation">
            <DotLottieReact
              src="/image-analysis.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        <div className="feature-item data-upload">
          <div className="feature-content">
            <h3>Data Upload</h3>
            <p>Easily upload and manage your data for seamless analysis.</p>
          </div>
          <div className="feature-animation">
            <DotLottieReact
              src="/data-upload.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        <div className="feature-item">
          <h3>Database Support</h3>
          <p>Manage and store data efficiently with robust database support.</p>
        </div>
        <div className="feature-item">
          <h3>Data Security</h3>
          <p>Ensure data protection with advanced security measures.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;


