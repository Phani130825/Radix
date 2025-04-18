import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ContactForm from "./components/ContactForm";
import UserManual from "./pages/UserManual";
import ResultsPage from "./pages/ResultsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UploadData from "./pages/UploadData";
import ViewReports from "./pages/ViewReports";
import "./styles/App.css";
import { useAuth } from "./AuthContext";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import FirebaseTest from './components/FirebaseTest';
import EmailVerification from './components/EmailVerification';

const App = () => {
  const { email, login } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/usermanual" element={<UserManual />} />
      <Route path="/results" element={<ResultsPage />} />

      {/* Authentication Routes - Protected from logged-in users */}
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignUp login={login} />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login login={login} />
          </PublicRoute>
        } 
      />
      <Route 
        path="/verify-email" 
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        } 
      />

      {/* Protected Routes - Only accessible to logged-in users */}
      <Route 
        path="/upload-data" 
        element={
          <PrivateRoute>
            <UploadData email={email} />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/view-reports" 
        element={
          <PrivateRoute>
            <ViewReports email={email} />
          </PrivateRoute>
        } 
      />

      {/* Add a route for the Firebase test component */}
      <Route path="/firebase-test" element={<FirebaseTest />} />

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;



