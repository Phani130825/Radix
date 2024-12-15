import React, { useEffect } from "react";
import "../styles/ResultsPage.css";

const ResultsPage = () => {
  useEffect(() => {
    const sections = document.querySelectorAll(".results-section");

    const observerOptions = {
      threshold: 0.3, // Trigger when 30% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing after animation
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Sticky Header Section */}
      <header className="results-header">
        <h1>RadiX: Results</h1>
        <p>
          Looking for a faster, more accurate way to diagnose chest X-rays? Look no further than
          ChestXpert - the radiologist-approved framework that uses cutting-edge Deep Learning
          techniques to analyze and generate detailed reports.
        </p>
      </header>

      {/* Content Sections */}
      <div className="results-container">
        {/* Section 1 */}
        <div className="results-section">
          <div className="content">
            <h2>Radiologist Accuracy</h2>
            <p>
              Our system generates highly accurate reports that align with professional radiologist
              assessments, ensuring confidence in diagnoses.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="results-section">
          <div className="content">
            <h2>Doctor Validation</h2>
            <p>
              Doctors rated our reports for their precision, highlighting that results achieved an
              accuracy of 95% on average.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="results-section">
          <div className="content">
            <h2>Interns & Medical Students</h2>
            <p>
              Medical interns evaluated the reports with outstanding results, boosting their
              confidence in learning and analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

