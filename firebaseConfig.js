// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0OgEzVUqT0RZ5KNa6wJq9c0TBcOPYYJc",
  authDomain: "habit-tracking-apps.firebaseapp.com",
  projectId: "habit-tracking-apps",
  storageBucket: "habit-tracking-apps.firebasestorage.app",
  messagingSenderId: "756305659674",
  appId: "1:756305659674:web:7e28ee6e7a7e9634078ea3",
  measurementId: "G-C8YG6YD9QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };