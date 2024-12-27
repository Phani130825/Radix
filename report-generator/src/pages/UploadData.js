

// import React, { useState } from "react";
// import { db } from '../firebase';

// import "../styles/UploadData.css";
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import { doc, getDoc, setDoc, collection } from 'firebase/firestore';


// const UploadData = ({ email }) => {
//   const [file, setFile] = useState(null);
//   const [stage, setStage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [prediction, setPrediction] = useState(null);
//   const [reportId, setReportId] = useState("");
//   const [role, setRole] = useState(null);
//   const location = useLocation();

// useEffect(() => {
//   const fetchRole = async () => {
//     if (location.state?.role) {
//       setRole(location.state.role);
//     } else if (email) {
//       try {
//         const userDocRef = doc(db, "login", email);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           setRole(userDoc.data().userType);
//           setUserName(userDoc.data().name);  // Set the user's name
//         }
//       } catch (err) {
//         console.error("Error fetching user role:", err);
//       }
//     }
//   };
//   fetchRole();
// }, [email, location.state]);

// const [userName, setUserName] = useState(null);



//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     setFile(droppedFile);
//   };

//   const handleSubmit = async () => {
//     if (file) {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const response = await fetch("http://localhost:5002/upload", {
//           method: "POST",
//           body: formData,
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (data.error) {
//             alert(data.error);
//           } else {
//             setPrediction(data.prediction);
//             setStage(2);
//           }
//         } else {
//           const errorData = await response.json();
//           alert(errorData.error || "Failed to process the file.");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert("An error occurred during file upload.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       alert("Please upload a file first.");
//     }
//   };

//   const handleGenerateReport = async () => {
//     if (!email) {
//       alert("User email not found. Please log in again.");
//       return;
//     }

//     const fakeReportId = "RPT" + Math.floor(Math.random() * 1000);
//     setReportId(fakeReportId);
//     setStage(3);

//     try {
//       const reportCollectionRef = collection(db, 'login', email, 'report');
//       const reportDocRef = doc(reportCollectionRef, fakeReportId);
//       const newReport = {
//         class: prediction.class,
//         image: URL.createObjectURL(file),
//         advice: prediction.confidence,
//       };

//       await setDoc(reportDocRef, newReport);
//       alert("Report stored successfully!");
//     } catch (err) {
//       console.error('Error storing the report in Firestore:', err);
//       alert('An error occurred while storing the report. Please try again.');
//     }
//   };

//   const preventDefault = (e) => e.preventDefault();


//   return (
//     <div className="container">
//     {role && userName && (
//       <h2>
//         {role === "Doctor" ? `Welcome, Dr. ${userName}!` : `Welcome, ${userName}!`}
//       </h2>
//     )}

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

//       {/* Stage Logic */}
//       {stage === 1 && (
//         <div>
//           <div
//             className="drop-area"
//             onDrop={handleDrop}
//             onDragOver={preventDefault}
//             onDragEnter={preventDefault}
//           >
//             <h3> Drop Your Image Here</h3>
//             <p>or</p>
//             <input type="file" onChange={handleFileChange} />
//             {file && (
//               <div style={{ marginTop: "20px" }}>
//                 <h4>Selected Image:</h4>
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt="Selected"
//                   width="200px"
//                   style={{ border: "1px solid #ddd", marginBottom: "20px" }}
//                 />
//               </div>
//             )}
//             <button onClick={handleSubmit} disabled={loading}>
//               {loading ? "Analyzing..." : "Submit / Analyze"}
//             </button>
//             {loading && (
//               <div className="spinner" style={{ margin: "10px auto", textAlign: "center" }}>
//                 <div
//                   style={{
//                     width: "30px",
//                     height: "30px",
//                     border: "3px solid #ccc",
//                     borderTop: "3px solid #007bff",
//                     borderRadius: "50%",
//                     animation: "spin 1s linear infinite",
//                   }}
//                 ></div>
//                 <style>
//                   {`@keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                   }`}
//                 </style>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {stage === 2 && prediction && (
//         <div className="report-stage">
//           <h3>Prediction Results</h3>
//           <p>Class: {prediction.class}</p>
//           <p>Confidence: {prediction.confidence}</p>
//           <button onClick={handleGenerateReport}>Generate Report</button>
//         </div>
//       )}

//       {stage === 3 && (
//         <div className="export-stage">
//           <h3>Export Report</h3>
//           <p>
//             Report ID: <strong>{reportId}</strong>
//           </p>
//           <img
//             src={URL.createObjectURL(file)}
//             alt="Uploaded"
//             width="200px"
//             style={{ border: "1px solid #ddd", marginTop: "20px", marginBottom: "25px" }}
//           />
//           <button 
//             onClick={() => {
//               alert("Report Exported!");
//               setFile(null);         // Reset file
//               setStage(1);           // Set stage back to 1
//               setPrediction(null);   // Clear prediction
//               setReportId("");       // Clear reportId
//             }}
//           >
//             Export
//           </button>
//         </div>
//       )}

//     </div>
//   );
// };

// export default UploadData;

import React, { useState } from "react";
import { db } from '../firebase';
import "../styles/UploadData.css";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

const UploadData = ({ email }) => {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [reportId, setReportId] = useState("");
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      if (location.state?.role) {
        setRole(location.state.role);
      } else if (email) {
        try {
          const userDocRef = doc(db, "login", email);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRole(userDoc.data().userType);
            setUserName(userDoc.data().name);  // Set the user's name
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      }
    };
    fetchRole();
  }, [email, location.state]);

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
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5002/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            alert(data.error);
          } else {
            setPrediction(data.prediction);
            setStage(2);
          }
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to process the file.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during file upload.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please upload a file first.");
    }
  };

  const handleGenerateReport = async () => {
    if (!email) {
      alert("User email not found. Please log in again.");
      return;
    }

    const fakeReportId = "RPT" + Math.floor(Math.random() * 1000);
    setReportId(fakeReportId);
    setStage(3);

    try {
      const reportCollectionRef = collection(db, 'login', email, 'report');
      const reportDocRef = doc(reportCollectionRef, fakeReportId);
      const newReport = {
        class: prediction.class,
        image: URL.createObjectURL(file),
        advice: prediction.confidence,
      };

      await setDoc(reportDocRef, newReport);
      alert("Report stored successfully!");
    } catch (err) {
      console.error('Error storing the report in Firestore:', err);
      alert('An error occurred while storing the report. Please try again.');
    }
  };

  const preventDefault = (e) => e.preventDefault();

  return (
    <div className="container">
      {role && userName && (
        <h2>
          {role === "Doctor" ? `Welcome, Dr. ${userName}!` : `Welcome, ${userName}!`}
        </h2>
      )}

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

      {/* Stage Logic */}
      {stage === 1 && (
        <div>
          <div
            className="drop-area"
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
          >
            <h3> Drop Your Image Here</h3>
            <p>or</p>
            <input type="file" onChange={handleFileChange} />
            {file && (
              <div style={{ marginTop: "20px" }}>
                <h4>Selected Image:</h4>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected"
                  width="200px"
                  style={{ border: "1px solid #ddd", marginBottom: "20px" }}
                />
              </div>
            )}
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Analyzing..." : "Submit / Analyze"}
            </button>
            {loading && (
              <div className="spinner" style={{ margin: "10px auto", textAlign: "center" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "3px solid #ccc",
                    borderTop: "3px solid #007bff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <style>
                  {`@keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }`}
                </style>
              </div>
            )}
          </div>
        </div>
      )}

      {stage === 2 && prediction && (
        <div className="report-stage">
          <h3>Prediction Results</h3>
          <p>Class: {prediction.class}</p>
          <p>Confidence: {prediction.confidence}</p>
          <button onClick={handleGenerateReport}>Generate Report</button>
        </div>
      )}

      {stage === 3 && (
        <div className="export-stage">
          <h3>Export Report</h3>
          <p>
            Report ID: <strong>{reportId}</strong>
          </p>
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            width="200px"
            style={{ border: "1px solid #ddd", marginTop: "20px", marginBottom: "25px" }}
          />
          <button 
            onClick={() => {
              alert("Report Exported!");
              setFile(null);         // Reset file
              setStage(1);           // Set stage back to 1
              setPrediction(null);   // Clear prediction
              setReportId("");       // Clear reportId
            }}
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadData;
