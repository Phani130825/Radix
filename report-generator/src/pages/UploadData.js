// import React, { useState } from 'react';
// // import '../styles/UploadData.css';

// const UploadData = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = () => {
//     if (file) {
//       console.log('File uploaded:', file);
//     } else {
//       console.log('No file selected.');
//     }
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Data</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// };

// export default UploadData;

import React, { useState } from "react";
import "../styles/UploadData.css";

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(1);
  const [report, setReport] = useState(null);
  const [reportId, setReportId] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleSubmit = () => {
    if (file) {
      console.log("File uploaded:", file);
      setStage(2);
    } else {
      alert("Please upload a file first.");
    }
  };

  const handleGenerateReport = () => {
    // Simulate report generation
    const fakeReportId = "RPT" + Math.floor(Math.random() * 1000);
    setReportId(fakeReportId);
    setReport(`Generated report for ${file.name}`);
    console.log("Report generated");
    setStage(3);
  };

  const preventDefault = (e) => e.preventDefault();

  return (
    <div className="container">
      {/* Stage Tracking Bar */}
      <div className="stage-bar">
        <div className={`stage ${stage >= 1 ? "active" : ""}`}>
          <div className="circle">1</div>
          <span>Upload Image</span>
        </div>
        <div className={`stage ${stage >= 2 ? "active" : ""}`}>
          <div className="circle">2</div>
          <span>Generate Report</span>
        </div>
        <div className={`stage ${stage >= 3 ? "active" : ""}`}>
          <div className="circle">3</div>
          <span>Export Report</span>
        </div>
      </div>

      {/* Stage 1: Upload File */}
      {stage === 1 && (
        <div
          className="drop-area"
          onDrop={handleDrop}
          onDragOver={preventDefault}
          onDragEnter={preventDefault}
        >
          <h3>Drag & Drop Your Image Here</h3>
          <p>or</p>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSubmit}>Submit / Analyze</button>
        </div>
      )}

      {/* Stage 2: Generate Report */}
      {stage === 2 && (
        <div className="report-stage">
          <h3>Generate Report</h3>
          <button onClick={handleGenerateReport}>Generate Report</button>
        </div>
      )}

      {/* Stage 3: Export and View Report */}
      {stage === 3 && (
        <div className="export-stage">
          <h3>Export Report</h3>
          <p>{report}</p>
          <p>
            Report ID: <strong>{reportId}</strong>
          </p>
          <div>
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded"
              width="200px"
              style={{ border: "1px solid #ddd", marginTop: "10px" }}
            />
          </div>
          <button onClick={() => alert("Report Exported!")}>Export</button>
        </div>
      )}
    </div>
  );
};

export default UploadData;

