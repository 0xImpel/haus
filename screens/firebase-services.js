import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration is already set up in your app
// This is just a demonstration of how to structure the Firestore functions

// Function to save a habit to Firestore
export const saveHabitToFirestore = async (habitData) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log('No user is signed in');
      return { success: false, error: 'User not authenticated' };
    }
    
    const db = getFirestore();
    
    // Add user ID to the habit data
    const habitWithUser = {
      ...habitData,
      userId: user.uid,
      createdAt: new Date(),
      completedDays: [],
      streak: 0,
      active: true
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'habits'), habitWithUser);
    console.log('Habit saved with ID:', docRef.id);
    
    return { 
      success: true, 
      habitId: docRef.id 
    };
  } catch (error) {
    console.error('Error saving habit:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Function to get all habits for the current user
export const getUserHabits = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log('No user is signed in');
      return [];
    }
    
    const db = getFirestore();
    const habitsQuery = query(
      collection(db, 'habits'), 
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(habitsQuery);
    
    const habits = [];
    querySnapshot.forEach((doc) => {
      habits.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return habits;
  } catch (error) {
    console.error('Error getting habits:', error);
    return [];
  }
};

// Example of how to use these functions:
// 1. To save a habit:
// const habitData = {
//   name: "Meditate",
//   time: "15m",
//   frequency: "everyday",
//   duration: "90 days"
// };
// const result = await saveHabitToFirestore(habitData);
// if (result.success) {
//   console.log("Habit saved with ID:", result.habitId);
// }
//
// 2. To get all habits:
// const habits = await getUserHabits();
// console.log("User habits:", habits);

console.log("Firebase Firestore service initialized");
