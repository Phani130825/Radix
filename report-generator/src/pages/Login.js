import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../styles/Login.css';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user exists in Firestore's login collection
      const userDocRef = doc(db, "login", formData.email);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setError("Account not found. Please sign up first.");
        return;
      }

      const userData = userDoc.data();
      
      // Check if password matches
      if (userData.password === formData.password) {
        // Login successful
        login(formData.email);
        navigate("/upload-data", { state: { role: userData.userType } });
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account?{' '}
          <span className="toggle-auth" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;


