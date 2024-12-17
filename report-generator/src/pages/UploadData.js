

// import React, { useState } from "react";
// import "../styles/UploadData.css";

// const UploadData = () => {
//   const [file, setFile] = useState(null);
//   const [stage, setStage] = useState(1);
//   const [report, setReport] = useState(null);
//   const [reportId, setReportId] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     setFile(droppedFile);
//   };

//   const handleSubmit = () => {
//     if (file) {
//       console.log("File uploaded:", file);
//       setStage(2);
//     } else {
//       alert("Please upload a file first.");
//     }
//   };

//   const handleGenerateReport = () => {
//     // Simulate report generation
//     const fakeReportId = "RPT" + Math.floor(Math.random() * 1000);
//     setReportId(fakeReportId);
//     setReport(`Generated report for ${file.name}`);
//     console.log("Report generated");
//     setStage(3);
//   };

//   const preventDefault = (e) => e.preventDefault();

//   return (
//     <div className="container">
//       {/* Stage Tracking Bar */}
//       <div className="stage-bar">
//         <div className={`stage ${stage >= 1 ? "active" : ""}`}>
//           <div className="circle">1</div>
//           <span>Upload Image</span>
//         </div>
//         <div className={`stage ${stage >= 2 ? "active" : ""}`}>
//           <div className="circle">2</div>
//           <span>Generate Report</span>
//         </div>
//         <div className={`stage ${stage >= 3 ? "active" : ""}`}>
//           <div className="circle">3</div>
//           <span>Export Report</span>
//         </div>
//       </div>

//       {/* Stage 1: Upload File */}
//       {stage === 1 && (
//         <div
//           className="drop-area"
//           onDrop={handleDrop}
//           onDragOver={preventDefault}
//           onDragEnter={preventDefault}
//         >
//           <h3>Drag & Drop Your Image Here</h3>
//           <p>or</p>
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={handleSubmit}>Submit / Analyze</button>
//         </div>
//       )}

//       {/* Stage 2: Generate Report */}
//       {stage === 2 && (
//         <div className="report-stage">
//           <h3>Generate Report</h3>
//           <button onClick={handleGenerateReport}>Generate Report</button>
//         </div>
//       )}

//       {/* Stage 3: Export and View Report */}
//       {stage === 3 && (
//         <div className="export-stage">
//           <h3>Export Report</h3>
//           <p>{report}</p>
//           <p>
//             Report ID: <strong>{reportId}</strong>
//           </p>
//           <div>
//             <img
//               src={URL.createObjectURL(file)}
//               alt="Uploaded"
//               width="200px"
//               style={{ border: "1px solid #ddd", marginTop: "10px" }}
//             />
//           </div>
//           <button onClick={() => alert("Report Exported!")}>Export</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadData;
import React, { useState } from "react";
import "../styles/UploadData.css";

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [reportId, setReportId] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5001/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setPrediction(data.prediction);
          setStage(2); // Move to the next stage
        } else {
          alert("Failed to process the file.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during file upload.");
      }
    } else {
      alert("Please upload a file first.");
    }
  };

  const handleGenerateReport = () => {
    const fakeReportId = "RPT" + Math.floor(Math.random() * 1000);
    setReportId(fakeReportId);
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

      {/* Stage 2: Display Prediction */}
      {stage === 2 && prediction && (
        <div className="report-stage">
          <h3>Prediction Results</h3>
          <p>Class: {prediction.class}</p>
          <p>Confidence: {prediction.confidence.toFixed(2)}</p>
          <button onClick={handleGenerateReport}>Generate Report</button>
        </div>
      )}

      {/* Stage 3: Export and View Report */}
      {stage === 3 && (
        <div className="export-stage">
          <h3>Export Report</h3>
          <p>Report ID: <strong>{reportId}</strong></p>
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            width="200px"
            style={{ border: "1px solid #ddd", marginTop: "20px", marginBottom:"25px"}}
          />
          <button onClick={() => alert("Report Exported!")}>Export</button>
        </div>
      )}
    </div>
  );
};

export default UploadData;
