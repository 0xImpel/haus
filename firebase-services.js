import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "./firebase-config"

// Function to save a habit to Firestore
export const saveHabitToFirestore = async (habitData) => {
  try {
    const user = auth.currentUser

    if (!user) {
      console.log("No user is signed in")
      return { success: false, error: "User not authenticated" }
    }

    // Add user ID to the habit data
    const habitWithUser = {
      ...habitData,
      userId: user.uid,
      createdAt: new Date(),
      completedDays: [],
      streak: 0,
      active: true,
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, "habits"), habitWithUser)
    console.log("Habit saved with ID:", docRef.id)

    return {
      success: true,
      habitId: docRef.id,
    }
  } catch (error) {
    console.error("Error saving habit:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Function to get all habits for the current user
export const getUserHabits = async () => {
  try {
    const user = auth.currentUser

    if (!user) {
      console.log("No user is signed in")
      return []
    }

    const habitsQuery = query(collection(db, "habits"), where("userId", "==", user.uid))

    const querySnapshot = await getDocs(habitsQuery)

    const habits = []
    querySnapshot.forEach((doc) => {
      habits.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return habits
  } catch (error) {
    console.error("Error getting habits:", error)
    return []
  }
}
