import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '../firebase';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import '../styles/SignUp.css';

const SignUp = ({ login }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    name: '',
    age: '',
    weight: '',
    height: '',
    questions: {} 
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  const questions = [
    "Do you understand medical terminology?",
    "Do you have prior experience in patient care?",
    "Are you a licensed medical practitioner?",
  ];

  // Enhanced email verification status check
  useEffect(() => {
    if (verificationSent) {
      const checkVerification = async () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Reload the user to get the latest emailVerified status
            await reload(user);
            if (user.emailVerified) {
              setCurrentStage(1);
              setVerificationSent(false);
              unsubscribe();
            }
          }
        });
      };

      // Check verification status every 3 seconds
      const interval = setInterval(async () => {
        if (auth.currentUser) {
          await reload(auth.currentUser);
          if (auth.currentUser.emailVerified) {
            setCurrentStage(1);
            setVerificationSent(false);
            clearInterval(interval);
          }
        }
      }, 3000);

      checkVerification();

      // Cleanup
      return () => {
        clearInterval(interval);
      };
    }
  }, [verificationSent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('questions.')) {
      const index = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        questions: {
          ...prev.questions,
          [index]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    switch (score) {
      case 0:
        message = 'Password is too short.';
        break;
      case 1:
        message = 'Password is weak. Add uppercase letters, numbers, and special characters.';
        break;
      case 2:
        message = 'Password is moderate. Add more complexity.';
        break;
      case 3:
        message = 'Password is good.';
        break;
      case 4:
        message = 'Password is strong.';
        break;
      default:
        message = '';
    }

    setPasswordStrength({ score, message });
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendVerificationLink = async () => {
    try {
      setLoading(true);
      setError('');

      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (passwordStrength.score < 3) {
        setError(`Password is too weak. ${passwordStrength.message}`);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Only check if email exists in Firestore login collection
      const userDocRef = doc(db, "login", formData.email);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setError("Email already exists. Please use a different email or login.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
        alert("Verification link sent! Please check your email and click the link to verify your account. The page will automatically update once verified.");
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          const user = auth.currentUser;
          if (user) {
            await sendEmailVerification(user);
            setVerificationSent(true);
            alert("Verification link sent! Please check your email and click the link to verify your account. The page will automatically update once verified.");
          }
        } else {
          setError(authError.message);
        }
      }
    } catch (error) {
      console.error("Error during signup process:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Validate all questions are answered
      const allQuestionsAnswered = questions.every((_, index) => formData.questions[index]);
      if (!allQuestionsAnswered) {
        setError("Please answer all medical questions.");
        return;
      }

      // Determine if user is a doctor based on all "yes" answers
      const isDoctor = questions.every((_, index) => formData.questions[index] === "yes");
      
      const userDocRef = doc(db, "login", formData.email);
      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.name || '',
        age: formData.age || '',
        weight: formData.weight || '',
        height: formData.height || '',
        questions: formData.questions,
        userType: isDoctor ? "Doctor" : "User",
        emailVerified: true
      };

      await setDoc(userDocRef, newUser);
      
      // Log in the user
      login(formData.email);

      // Show appropriate welcome message
      const welcomeMessage = isDoctor 
        ? `Welcome Dr. ${formData.name}!` 
        : `Hello ${formData.name}...`;
      alert(welcomeMessage);

      // Navigate based on user type
      // Doctors will have access to result.py for analysis
      // Regular users will use predict.py for predictions
      navigate("/upload-data", { 
        state: { 
          role: newUser.userType,
          name: formData.name,
          pythonModel: isDoctor ? "result.py" : "predict.py"
        } 
      });

    } catch (err) {
      console.error("Error during signup:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStage === 1) {
      // Validate personal information
      if (!formData.name || !formData.age || !formData.weight || !formData.height) {
        setError("Please fill in all personal information fields.");
        return;
      }
      setCurrentStage(2);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 0:
        return (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={verificationSent}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={verificationSent}
              />
              <PasswordStrengthBar password={formData.password} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={verificationSent}
              />
            </div>
            <button
              type="button"
              onClick={handleSendVerificationLink}
              className="btn-primary"
              disabled={loading || !formData.email || !formData.password || !formData.confirmPassword || verificationSent}
            >
              {loading ? 'Sending Verification Link...' : verificationSent ? 'Verification Link Sent' : 'Send Verification Link'}
            </button>
            {verificationSent && (
              <div className="verification-message">
                <p>Please check your email and click the verification link.</p>
                <p>You will be automatically redirected once your email is verified.</p>
              </div>
            )}
          </>
        );
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3>Medical Questionnaire</h3>
            {questions.map((question, index) => (
              <div key={index} className="form-group">
                <label>{question}</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`questions.${index}`}
                      value="yes"
                      checked={formData.questions[index] === "yes"}
                      onChange={handleChange}
                      required
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`questions.${index}`}
                      value="no"
                      checked={formData.questions[index] === "no"}
                      onChange={handleChange}
                      required
                    />
                    No
                  </label>
                </div>
              </div>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        {renderStage()}
        <div className="button-group">
          {currentStage === 2 && (
            <button
              type="button"
              onClick={() => setCurrentStage(1)}
              className="btn-secondary"
              disabled={loading}
            >
              Previous
            </button>
          )}
          {currentStage < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Next'}
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Complete Sign Up'}
            </button>
          )}
        </div>
        <p>
          Already have an account?{' '}
          <span className="toggle-auth" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;