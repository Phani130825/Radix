import React, { useState } from "react";
import { db, storage } from '../firebase';

import "../styles/UploadData.css";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { doc, getDoc, setDoc, collection ,getDocs} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CustomDialog from '../components/CustomDialog';

const UploadData = ({ email }) => {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [reportId, setReportId] = useState("");
  const [role, setRole] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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

  // Upload image to Firebase Storage and get the download URL
  const uploadImageToFirebase = async (file, reportId) => {
    try {
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `reports/${email}/${reportId}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded successfully, URL:", downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file to Firebase Storage:", error);
      throw error;
    }
  };
// ... existing code ...

  // Function to generate a unique report ID
  const generateUniqueReportId = async () => {
    try {
      // Get all users' report collections
      const usersRef = collection(db, 'login');
      const usersSnapshot = await getDocs(usersRef);
      
      // Collect all existing report IDs
      const existingIds = new Set();
      
      // For each user, get their reports
      for (const userDoc of usersSnapshot.docs) {
        const reportsRef = collection(db, 'login', userDoc.id, 'report');
        const reportsSnapshot = await getDocs(reportsRef);
        reportsSnapshot.docs.forEach(doc => existingIds.add(doc.id));
      }

      // Generate a new unique ID
      let newId;
      do {
        // Format: RPTyearmonthday_sequential (e.g., RPT20240315_001)
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const sequential = String(Math.floor(Math.random() * 999)).padStart(3, '0');
        newId = `RPT${year}${month}${day}_${sequential}`;
      } while (existingIds.has(newId));

      return newId;
    } catch (error) {
      console.error('Error generating unique report ID:', error);
      throw error;
    }
  };

  const handleGenerateReport = async () => {
    if (!email) {
      showDialog("Error", "User email not found. Please log in again.");
      return;
    }

    try {
      // Generate a unique report ID
      const uniqueReportId = await generateUniqueReportId();
      setReportId(uniqueReportId);
      setStage(3);

      // Upload the image to Firebase Storage
      const imageDownloadURL = await uploadImageToFirebase(file, uniqueReportId);
      setImageUrl(imageDownloadURL);
      
      const reportCollectionRef = collection(db, 'login', email, 'report');
      const reportDocRef = doc(reportCollectionRef, uniqueReportId);

      const formattedTags = formatTags(prediction.tags);
      const newReport = {
        image: imageDownloadURL,
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

// ... rest of the existing code ...
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
              <p>
              You have been diagnosed with viral pneumonia. It is important to follow these guidelines for recovery:

              <strong>Rest and Hydration:</strong> Ensure adequate rest and drink plenty of fluids to stay hydrated. This helps your body fight the infection.

              <strong>Monitor symptoms</strong> Watch for worsening symptoms such as high fever, difficulty breathing, or chest pain. Seek immediate medical attention if these occur.
              </p>
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
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded"
              width="200px"
              style={{ border: "1px solid #ddd", marginTop: "20px", marginBottom: "25px" }}
            />
          ) : (
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded"
              width="200px"
              style={{ border: "1px solid #ddd", marginTop: "20px", marginBottom: "25px" }}
            />
          )}
          <button 
            onClick={async () => {
              try {
                const reportCollectionRef = collection(db, 'login', email, 'report');
                const reportDocRef = doc(reportCollectionRef, reportId);

                const reportData = {
                  class: prediction.class,
                  confidence: prediction.confidence,
                  image: URL.createObjectURL(file)
                };

                await setDoc(reportDocRef, reportData);
                showDialog("Success", "Report Exported!");
                
                // Reset the form
                setFile(null);
                setStage(1);
                setPrediction(null);
                setReportId("");
                setImageUrl(null);
              } catch (err) {
                console.error('Error exporting report:', err);
                showDialog("Error", 'Failed to export report. Please try again.');
              }
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
