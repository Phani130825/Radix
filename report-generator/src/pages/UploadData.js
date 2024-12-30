

// import React, { useState } from "react";
// import { db } from '../firebase';

// import "../styles/UploadData.css";
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
// import CustomDialog from '../components/CustomDialog';


// const UploadData = ({ email }) => {
//   const [file, setFile] = useState(null);
//   const [stage, setStage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [prediction, setPrediction] = useState(null);
//   const [reportId, setReportId] = useState("");
//   const [role, setRole] = useState(null);
//   const location = useLocation();

//   const [dialog, setDialog] = useState({ open: false, title: '', message: '' });

//   const showDialog = (title, message) => {
//     setDialog({ open: true, title, message });
//   };

//   const closeDialog = () => {
//     setDialog({ open: false, title: '', message: '' });
//   };

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
//       const headers = { 'email': email }; // Ensure email is included in the headers
  
//       try {
//         const response = await fetch("http://localhost:5002/upload", {
//           method: "POST",
//           body: formData,
//           headers: headers,
//         });
        
//         const data = await response.json();
//         console.log("Server Response:", data); // Log server response
        
//         if (response.ok) {
//           if (data.error) {
//             alert(data.error);
//           } else {
//             console.log("Prediction Data:", data);
//             setPrediction({ 
//               class: data.prediction.class, 
//               confidence: data.prediction.confidence,
//               tags: data.tags 
//             });
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
  
//   const formatTags = (tags) => {
//     if (Array.isArray(tags)) {
//       return tags.map(String); // Convert each tag to a string if it's not already.
//     }
//     if (tags && typeof tags === "object") {
//       return Object.entries(tags).reduce((acc, [key, value]) => {
//         acc[key] = String(value); // Ensure all values are strings.
//         return acc;
//       }, {});
//     }
//     return tags;
//   };
  
//   const formatPrediction = (prediction) => {
//     return {
//       class: prediction.class ? String(prediction.class) : "N/A",  // Ensure class is a string
//       confidence: prediction.confidence ? Number(prediction.confidence).toFixed(2) : "N/A",  // Ensure confidence is a number
//     };
//   };
  
//   const handlePredictionDisplay = (prediction) => {
//     if (prediction) {
//       const formattedPrediction = formatPrediction(prediction);
//       setPrediction(formattedPrediction);
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
  
//       const formattedTags = formatTags(prediction.tags); // Format tags
//       const newReport = {
//         image: URL.createObjectURL(file),
//         ...(role === "Doctor"
//           ? { tags: formattedTags }
//           : { class: prediction.class, confidence: prediction.confidence }),
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
//                     alignContent: "center",
//                     alignSelf: "center"
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
//         {role === "Doctor" ? (
//             prediction.tags && Array.isArray(prediction.tags) ? (
//               <ul>
//                 {prediction.tags.map((tag, index) => (
//                   <li key={index}>{tag}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No tags available.</p>
//             )
//           ) : (
//             <>
//               <p>Class: {prediction.class || "N/A"}</p>
//               <p>Confidence: {prediction.confidence || "N/A"}</p>
//             </>
//           )}

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
import CustomDialog from '../components/CustomDialog';

const UploadData = ({ email }) => {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [reportId, setReportId] = useState("");
  const [role, setRole] = useState(null);
  const location = useLocation();

  const [dialog, setDialog] = useState({ open: false, title: '', message: '' });

  const showDialog = (title, message) => {
    setDialog({ open: true, title, message });
  };

  const closeDialog = () => {
    setDialog({ open: false, title: '', message: '' });
  };

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
            setUserName(userDoc.data().name);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      }
    };
    fetchRole();
  }, [email, location.state]);

  const [userName, setUserName] = useState(null);

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
      const headers = { 'email': email };

      try {
        const response = await fetch("http://localhost:5002/upload", {
          method: "POST",
          body: formData,
          headers: headers,
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok) {
          if (data.error) {
            showDialog("Error", data.error);
          } else {
            console.log("Prediction Data:", data);
            setPrediction({ 
              class: data.prediction.class, 
              confidence: data.prediction.confidence,
              tags: data.tags 
            });
            setStage(2);
          }
        } else {
          const errorData = await response.json();
          showDialog("Error", errorData.error || "Failed to process the file.");
        }
      } catch (error) {
        console.error("Error:", error);
        showDialog("Error", "An error occurred during file upload.");
      } finally {
        setLoading(false);
      }
    } else {
      showDialog("Warning", "Please upload a file first.");
    }
  };


  const formatTags = (tags) => {
    if (Array.isArray(tags)) {
      return tags.map(String); // Convert each tag to a string if it's not already.
    }
    if (tags && typeof tags === "object") {
      return Object.entries(tags).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Ensure all values are strings.
        return acc;
      }, {});
    }
    return tags;
  };
  
  const formatPrediction = (prediction) => {
    return {
      class: prediction.class ? String(prediction.class) : "N/A",  // Ensure class is a string
      confidence: prediction.confidence ? Number(prediction.confidence).toFixed(2) : "N/A",  // Ensure confidence is a number
    };
  };
  
  const handlePredictionDisplay = (prediction) => {
    if (prediction) {
      const formattedPrediction = formatPrediction(prediction);
      setPrediction(formattedPrediction);
    }
  };


  const handleGenerateReport = async () => {
    if (!email) {
      showDialog("Error", "User email not found. Please log in again.");
      return;
    }

    const fakeReportId = "RPT" + Math.floor(Math.random() * 1000);
    setReportId(fakeReportId);
    setStage(3);

    try {
      const reportCollectionRef = collection(db, 'login', email, 'report');
      const reportDocRef = doc(reportCollectionRef, fakeReportId);

      const formattedTags = formatTags(prediction.tags);
      const newReport = {
        image: URL.createObjectURL(file),
        ...(role === "Doctor"
          ? { tags: formattedTags }
          : { class: prediction.class, confidence: prediction.confidence }),
      };

      await setDoc(reportDocRef, newReport);
      showDialog("Success", "Report stored successfully!");
    } catch (err) {
      console.error('Error storing the report in Firestore:', err);
      showDialog("Error", 'An error occurred while storing the report. Please try again.');
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

      {/* Dialog Component */}
      {dialog.open && (
        <CustomDialog
          title={dialog.title}
          message={dialog.message}
          onClose={closeDialog}
        />
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
                    alignContent: "center",
                    alignSelf: "center"
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
          {role === "Doctor" ? (
            prediction.tags && Array.isArray(prediction.tags) ? (
              <ul>
                {prediction.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            ) : (
              <p>No tags available.</p>
            )
          ) : (
            <>
              <p>Class: {prediction.class || "N/A"}</p>
              <p>Confidence: {prediction.confidence || "N/A"}</p>
            </>
          )}

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
              showDialog("Success", "Report Exported!");
              setFile(null);
              setStage(1);
              setPrediction(null);
              setReportId("");
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
