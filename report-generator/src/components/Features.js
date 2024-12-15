import React from "react";
import "./../styles/Features.css";

const Features = () => {
  return (
    <section className="features">
      <h2>Features</h2>
      <div className="feature-list">
        <div className="feature-item">
          <h3>Customizable Reports</h3>
          <p>Create reports tailored to your needs.</p>
        </div>
        <div className="feature-item">
          <h3>Real-Time Analysis</h3>
          <p>Analyze data with live feedback.</p>
        </div>
        <div className="feature-item">
          <h3>Secure Data</h3>
          <p>Your data is protected with top-notch security.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
