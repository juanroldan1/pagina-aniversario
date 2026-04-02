// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtdBcf3GxkGSJDrVlaHLiIJiVkcSPvYdU",
  authDomain: "lovers191305.firebaseapp.com",
  projectId: "lovers191305",
  storageBucket: "lovers191305.firebasestorage.app",
  messagingSenderId: "773103952408",
  appId: "1:773103952408:web:039425faa7c7ee51d6996d",
  measurementId: "G-N35VPPQW8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);