import React, { useState, useEffect } from "react";
import { db } from '../firebase';

import "../styles/UploadData.css";
import { useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import CustomDialog from '../components/CustomDialog';

const UploadData = ({ email }) => {
  const [files, setFiles] = useState([]);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [reportId, setReportId] = useState("");
  const [role, setRole] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [userName, setUserName] = useState(null);
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Limit to 1 file
    if (selectedFiles.length > 1) {
      showDialog("Warning", "Please select only one file at a time.");
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      if (!isValidType) {
        showDialog("Error", `${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length > 0) {
      // Check if user is doctor and validate number of files
      if (role === "Doctor" && droppedFiles.length > 4) {
        showDialog("Error", "Maximum 4 images allowed for doctors.");
        return;
      }

      // Validate each file
      const validFiles = droppedFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          showDialog("Error", "Please drop only image files.");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showDialog("Error", "Each file should be less than 5MB.");
          return false;
        }
        return true;
      });

      setFiles(validFiles);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      showDialog("Warning", "Please upload a file.");
      return;
    }

    setLoading(true);
    const predictionsArray = [];

    try {
      // Check if server is available with timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const serverCheck = await fetch("http://localhost:5002/health", {
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!serverCheck.ok) {
          throw new Error("Server is not responding properly");
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          showDialog("Error", "Server connection timed out. Please make sure the server is running.");
        } else {
          showDialog("Error", "Cannot connect to the server. Please make sure the server is running at http://localhost:5002");
        }
        setLoading(false);
        return;
      }

      const file = files[0]; // Since we only allow one file now
      const formData = new FormData();
      formData.append("file", file);
      const headers = { 'email': email };

      // Add timeout to the upload request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for upload

      const response = await fetch("http://localhost:5002/upload", {
        method: "POST",
        body: formData,
        headers: headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        if (data.error) {
          showDialog("Error", data.error);
        } else {
          predictionsArray.push({
            prediction: data.prediction,
            tags: data.tags || [],
            status: data.status,
            file: file
          });
          setPredictions(predictionsArray);
          setStage(2);
        }
      } else {
        showDialog("Error", data.error || "Failed to process the file.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.name === 'AbortError') {
        showDialog("Error", "Upload timed out. Please try again with a smaller file or check your internet connection.");
      } else {
        showDialog("Error", "An error occurred during file upload. Please try again.");
      }
    } finally {
      setLoading(false);
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
    }
  };

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

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to compress image before converting to base64
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleGenerateReport = async () => {
    if (!email) {
      showDialog("Error", "User email not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      // Generate a unique report ID
      const newReportId = await generateUniqueReportId();
      setReportId(newReportId);

      // Get the file
      const file = files[0];
      if (!file) {
        throw new Error("No file selected for upload");
      }

      // Compress and convert image to base64
      console.log("Converting image to base64...");
      const compressedImage = await compressImage(file);
      console.log("Image converted successfully");

      // Prepare report data
      const reportData = {
        id: newReportId,
        generatedBy: userName || email,
        status: "Completed",
        image: compressedImage, // Store base64 string directly
        captions: [predictions[0].prediction],
        tags: predictions[0].tags || [],
        timestamp: new Date().toISOString(),
        userType: role
      };

      // Save report to Firestore
      console.log("Saving report to Firestore...");
      const reportRef = doc(db, "login", email, "report", newReportId);
      await setDoc(reportRef, reportData);

      console.log("Report saved successfully");
      setImageUrls([compressedImage]); // Use base64 string directly
      setStage(3);
    } catch (error) {
      console.error("Error generating report:", error);
      showDialog("Error", `Failed to generate report: ${error.message}`);
      setStage(2);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      if (!imageUrls || imageUrls.length === 0 || !imageUrls[0]) {
        showDialog("Error", "No image URL found. Please try generating the report again.");
        return;
      }

      // Verify the image URL is still accessible
      try {
        const response = await fetch(imageUrls[0], { method: 'HEAD' });
        if (!response.ok) {
          throw new Error("Image URL is no longer accessible");
        }
      } catch (urlError) {
        console.error("Error verifying image URL:", urlError);
        showDialog("Error", "Image URL is no longer accessible. Please try generating the report again.");
        return;
      }

      const reportRef = doc(db, 'login', email, 'report', reportId);

      // Update the existing report with final data
      const reportData = {
        image: imageUrls[0],
        captions: predictions.map(p => p.prediction),
        status: "Completed",
        timestamp: new Date().toISOString(),
        generatedBy: userName || email,
        tags: predictions.flatMap(p => p.tags || [])
      };

      await setDoc(reportRef, reportData);
      showDialog("Success", "Report Exported!");

      // Reset the form
      setFiles([]);
      setStage(1);
      setPredictions([]);
      setReportId("");
      setImageUrls([]);
    } catch (err) {
      console.error('Error exporting report:', err);
      showDialog("Error", 'Failed to export report. Please try again.');
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
          <span>Upload Image{role === "Doctor" ? "s" : ""}</span>
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
            <h3>Drop Your Image{role === "Doctor" ? "s" : ""} Here</h3>
            <p>or</p>
            <input
              type="file"
              onChange={handleFileChange}
              multiple={role === "Doctor"}
              accept="image/*"
            />
            {files.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Selected Image{files.length > 1 ? "s" : ""}:</h4>
                <div className="selected-images">
                  {files.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index + 1}`}
                        width="200px"
                        style={{ border: "1px solid #ddd", marginBottom: "20px" }}
                      />
                    </div>
                  ))}
                </div>
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

      {stage === 2 && predictions.length > 0 && (
        <div className="report-stage">
          <h3>Analysis Results</h3>
          {predictions.map((prediction, index) => (
            <div key={index} className="prediction-section">
              <h4>Image {index + 1}</h4>
              <h4>Status: {prediction.status}</h4>
              <div className="prediction-content">
                <h4>Analysis:</h4>
                <p>{prediction.prediction}</p>
              </div>
              {role === "Doctor" && prediction.tags && prediction.tags.length > 0 && (
                <div className="tags-section">
                  <h4>Tags:</h4>
                  <ul>
                    {prediction.tags.map((tag, tagIndex) => (
                      <li key={tagIndex}>{tag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <button onClick={handleGenerateReport}>Generate Report</button>
        </div>
      )}

      {stage === 3 && (
        <div className="export-stage">
          <h3>Export Report</h3>
          <p>
            Report ID: <strong>{reportId}</strong>
          </p>
          {imageUrls[0] && (
            <img
              src={imageUrls[0]}
              alt="Uploaded"
              width="400px"
              style={{ border: "1px solid #ddd", marginTop: "20px", marginBottom: "25px" }}
            />
          )}
          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );
};

export default UploadData;
