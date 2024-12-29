
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import UserManual from "./pages/UserManual";
import ResultsPage from "./pages/ResultsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UploadData from "./pages/UploadData";
import ViewReports from "./pages/ViewReports";
import "./styles/App.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANBvwpdtj5bIazx5Pl-mOQf4EuaqfdpFI",
  authDomain: "radix-3abe9.firebaseapp.com",
  databaseURL: "https://radix-3abe9-default-rtdb.firebaseio.com",
  projectId: "radix-3abe9",
  storageBucket: "radix-3abe9.firebasestorage.app",
  messagingSenderId: "191442213053",
  appId: "1:191442213053:web:cec8dcddc7984276c3ffd4",
  measurementId: "G-1QQPBLD2BT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const App = ({ isLoggedIn, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");

  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/usermanual" element={<UserManual />} />
      <Route path="/results" element={<ResultsPage />} />

      {/* Authentication Routes */}
      <Route 
        path="/signup" 
        element={<SignUp setIsLoggedIn={setIsLoggedIn} setEmail={setEmail} />} 
      />
      <Route 
        path="/login" 
        element={<Login setIsLoggedIn={setIsLoggedIn} setEmail={setEmail} />} 
      />

      {/* Protected Routes */}
      {isLoggedIn && (
        <>
          <Route 
            path="/upload-data" 
            element={<UploadData email={email} />} 
          />
          <Route 
            path="/view-reports" 
            element={<ViewReports email={email} />} 
          />
        </>
      )}

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;



