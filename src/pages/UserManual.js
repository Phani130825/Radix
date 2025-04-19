import React from 'react';
import '../styles/UserManual.css';


const UserManual = () => {
  const steps = [
    { step: 1, phase: 'Login' , text: 'Click on Get started button to sign up / log in', video: '/v1.mp4' },
    { step: 2,phase: 'Fill Up' , text: 'Fill up the details and log in', video: '/v2.mp4' },
    { step: 3, phase: 'Analyse' ,text: 'Select the image & click on Submit/Analyse button', video: '/v3.mp4' },
    { step: 4, phase: 'Store Report' ,text: 'Save the report', video: '/v4.mp4' },
    { step: 5,phase: 'View Reports' , text: 'Navigate to View Reports to view & download your reports', video: '/v5.mp4' },
    { step: 6, phase: 'Download Reports' ,text: 'Click on download pdf to save the report in PDF format', video: '/v6.mp4' },
  ];

  return (
    <div className="user-manual-container">
      <h1 className="manual-title">Radix: User Manual</h1>
      <p>
      Follow the below steps to generate report of your x-ray 
      </p>
      {steps.map((item) => (
        <div key={item.step} className="manual-step">
          <div className="step-icon">
            <span>STEP</span>
            <h2>{item.step}</h2>
          </div>
          <div className="step-content">
            <h3>{item.phase}</h3>
            <p>{item.text}</p>
          
            <video
              src={item.video}
              autoPlay
              loop
              muted
              className="step-video"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserManual;
