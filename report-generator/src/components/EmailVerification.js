import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { applyActionCode } from 'firebase/auth';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the oobCode from the URL
        const urlParams = new URLSearchParams(location.search);
        const oobCode = urlParams.get('oobCode');
        
        if (!oobCode) {
          setVerificationStatus('Error');
          setError('Verification code is missing. Please try again.');
          return;
        }

        // Apply the verification code
        await applyActionCode(auth, oobCode);
        
        setVerificationStatus('Success');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('Error');
        setError(`Verification failed: ${error.message}`);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="auth-container">
      <h2>Email Verification</h2>
      <div className="verification-status">
        {verificationStatus === 'Verifying...' && (
          <p>Please wait while we verify your email address...</p>
        )}
        
        {verificationStatus === 'Success' && (
          <div>
            <p className="success-message">Your email has been successfully verified!</p>
            <p>You will be redirected to the login page in a few seconds.</p>
          </div>
        )}
        
        {verificationStatus === 'Error' && (
          <div>
            <p className="error-message">{error}</p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 