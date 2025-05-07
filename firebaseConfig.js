// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD0OgEzVUqT0RZ5KNa6wJq9c0TBcOPYYJc',
  authDomain: 'habit-tracking-apps.firebaseapp.com',
  projectId: 'habit-tracking-apps',
  storageBucket: 'habit-tracking-apps.appspot.com',
  messagingSenderId: '756305659674',
  appId: '1:756305659674:web:7e28ee6e7a7e9634078ea3',
  measurementId: 'G-C8YG6YD9QX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use this for React Native: initializeAuth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// (Skip getAnalytics — it’s for web only)
export { auth };
