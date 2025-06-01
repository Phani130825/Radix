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
  storageBucket: "radix-3abe9.appspot.com",
  messagingSenderId: "191442213053",
  appId: "1:191442213053:web:cec8dcddc7984276c3ffd4",
  measurementId: "G-1QQPBLD2BT"
};

let app;
let db;
let storage;
let auth;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");

  // Initialize Firestore
  db = getFirestore(app);
  console.log("Firestore initialized successfully");

  // Initialize Storage
  storage = getStorage(app);
  console.log("Storage initialized successfully");

  // Initialize Authentication
  auth = getAuth(app);
  console.log("Authentication initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Configure CORS for Firebase Storage
const corsConfig = {
  origin: ["http://localhost:3000", "https://radix-3abe9.web.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Content-Length", "Content-Range", "Content-Disposition"],
  credentials: true,
  maxAgeSeconds: 3600
};

// Export initialized services
export { db, storage, auth, corsConfig };
