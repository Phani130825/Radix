import React from "react";
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Radix</h1>
      <p>Radix is dedicated to revolutionizing medical imaging with AI technology, ensuring accurate and efficient diagnostics.</p>
      
      <div className="video-card">
        <video controls>
          <source src="path/to/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3>Cutting-edge Imaging Techniques</h3>
        <p>Discover how Radix leverages advanced AI to enhance medical imaging precision.</p>
      </div>
      
      <div className="video-card">
        <video controls>
          <source src="path/to/video2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3>Expert Radiologist Collaboration</h3>
        <p>Learn about our partnerships with top radiologists for reliable and thorough diagnostics.</p>
      </div>
      
      <div className="video-card">
        <video controls>
          <source src="path/to/video3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h3>Innovation in AI for Health</h3>
        <p>Explore how Radix integrates AI technology to support healthcare professionals worldwide.</p>
      </div>
    </div>
  );
};

export default About;
