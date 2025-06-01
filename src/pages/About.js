import React from "react";
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Radix</h1>
      <p>Radix is dedicated to revolutionizing medical imaging with AI technology, ensuring accurate and efficient diagnostics.</p>
      
      <div className="video-card">
        <video controls>
          <source src="/v1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3>Image analysis using CNN</h3>
        <p>Discover how Radix leverages advanced AI to enhance medical imaging precision.</p>
      </div>
      
      <div className="video-card">
        <video controls>
          <source src="/v2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3>For Radiologist </h3>
        <p>Radiologist can reduce their time spent on analysing reports</p>
      </div>
      
    </div>
  );
};

export default About;
