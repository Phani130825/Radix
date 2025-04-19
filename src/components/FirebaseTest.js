import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { checkFirebaseAuth } from '../firebase-auth-check';

const FirebaseTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('Checking...');

  useEffect(() => {
    // Check if Firebase Auth is initialized
    console.log('Firebase Auth instance:', auth);
    
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in:', user.email);
        setResult(`User is signed in: ${user.email}`);
      } else {
        console.log('No user is signed in');
        setResult('No user is signed in');
      }
    });

    // Run the Firebase Auth check
    const runAuthCheck = async () => {
      try {
        const checkResult = await checkFirebaseAuth();
        setAuthStatus(checkResult.message);
        if (!checkResult.success) {
          setError(checkResult.message);
        }
      } catch (err) {
        console.error('Error checking Firebase Auth:', err);
        setAuthStatus('Error checking Firebase Auth');
        setError(err.message);
      }
    };

    runAuthCheck();

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      setResult(`User created: ${userCredential.user.email}`);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(`Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      setResult(`User signed in: ${userCredential.user.email}`);
    } catch (error) {
      console.error('Error signing in:', error);
      setError(`Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signOut(auth);
      console.log('User signed out');
      setResult('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(`Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Firebase Authentication Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Firebase Auth Status</h3>
        <p>{authStatus}</p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Current Status</h3>
        <p>{result}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
          
          <button 
            type="button" 
            onClick={handleSignIn}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Sign In
          </button>
          
          <button 
            type="button" 
            onClick={handleSignOut}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default FirebaseTest; 