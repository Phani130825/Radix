// This script checks if Firebase Authentication is properly enabled
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Function to check if Firebase Auth is working
export const checkFirebaseAuth = async () => {
  console.log('Checking Firebase Authentication...');
  console.log('Auth instance:', auth);
  
  try {
    // Try to create a test user
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123!@#';
    
    console.log(`Attempting to create test user: ${testEmail}`);
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('Test user created successfully:', userCredential.user.uid);
    
    // Sign out the test user
    await signOut(auth);
    console.log('Test user signed out successfully');
    
    return {
      success: true,
      message: 'Firebase Authentication is working correctly'
    };
  } catch (error) {
    console.error('Firebase Authentication check failed:', error);
    return {
      success: false,
      message: `Firebase Authentication error: ${error.code} - ${error.message}`
    };
  }
}; 