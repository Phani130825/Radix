// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyANBvwpdtj5bIazx5Pl-mOQf4EuaqfdpFI",
//   authDomain: "radix-3abe9.firebaseapp.com",
//   databaseURL: "https://radix-3abe9-default-rtdb.firebaseio.com",
//   projectId: "radix-3abe9",
//   storageBucket: "radix-3abe9.firebasestorage.app",
//   messagingSenderId: "191442213053",
//   appId: "1:191442213053:web:cec8dcddc7984276c3ffd4",
//   measurementId: "G-1QQPBLD2BT"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Authentication
const auth = getAuth(app);

export { db, storage, auth };
