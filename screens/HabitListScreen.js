"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Confirmation modal for habit deletion
const DeleteConfirmationModal = ({ visible, habitName, percentLoss, onKeep, onDelete }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onKeep}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Are you sure?</Text>
            <Text style={styles.confirmationText}>
              By removing this habit, you'll lose {percentLoss}% of your progress. Every brick in your house reflects
              your commitment.
            </Text>

            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={styles.keepButton} onPress={onKeep}>
                <Text style={styles.keepButtonText}>Keep it</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.deleteButtonText}>Yes, delete it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

// Completion modal for when a habit reaches its duration
const CompletionModal = ({ visible, habitName, onContinue, onLetGo }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.confirmationModal}>
          <Text style={styles.confirmationTitle}>Congratulations!</Text>
          <Text style={styles.confirmationText}>
            You've completed your habit "{habitName}". What would you like to do next?
          </Text>

          <View style={styles.confirmationButtons}>
            <TouchableOpacity style={styles.keepButton} onPress={onContinue}>
              <Text style={styles.keepButtonText}>Continue as lifestyle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={onLetGo}>
              <Text style={styles.deleteButtonText}>Let it go</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export function HabitListScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [isLoading, setIsLoading] = useState(true)
  const [habits, setHabits] = useState(route.params?.habits || [])
  const [completedHabits, setCompletedHabits] = useState({})
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [completionModalVisible, setCompletionModalVisible] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [longPressedHabit, setLongPressedHabit] = useState(null)
  const [allHabitsCompleted, setAllHabitsCompleted] = useState(false)

  // Fetch habits from Firebase when component mounts
  useEffect(() => {
    fetchHabitsFromFirebase()
  }, [])

  // Check if all habits are completed
  useEffect(() => {
    if (habits.length > 0) {
      const allCompleted = habits.every((habit) => completedHabits[habit.id])
      setAllHabitsCompleted(allCompleted)
    } else {
      setAllHabitsCompleted(false)
    }
  }, [habits, completedHabits])

  // Function to fetch habits from Firebase
  const fetchHabitsFromFirebase = async () => {
    try {
      setIsLoading(true)
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        console.log("No user is signed in")
        setIsLoading(false)
        return
      }

      const db = getFirestore()
      const habitsQuery = query(collection(db, "habits"), where("userId", "==", user.uid))

      const querySnapshot = await getDocs(habitsQuery)

      const fetchedHabits = []
      const completedStatus = {}

      querySnapshot.forEach((doc) => {
        const habitData = doc.data()
        fetchedHabits.push({
          id: doc.id,
          ...habitData,
        })

        // Initialize completed status from database
        completedStatus[doc.id] = habitData.completedToday || false
      })

      // If we have habits from Firebase, use those
      if (fetchedHabits.length > 0) {
        setHabits(fetchedHabits)
        setCompletedHabits(completedStatus)
      }
    } catch (error) {
      console.error("Error fetching habits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addNewHabit = () => {
    navigation.navigate("CreateHabit")
  }

  const lockAndViewHaus = () => {
    // Only allow if all habits are completed
    if (allHabitsCompleted) {
      // Navigate to the Haus view or implement locking functionality
      console.log("Lock and view haus")
    } else {
      Alert.alert("Complete Habits", "Please complete all your habits before viewing your haus.")
    }
  }

  const toggleHabitCompletion = async (habit) => {
    try {
      const newCompletedState = !completedHabits[habit.id]

      // Update local state
      setCompletedHabits((prev) => ({
        ...prev,
        [habit.id]: newCompletedState,
      }))

      // Update in Firebase
      const db = getFirestore()
      const habitRef = doc(db, "habits", habit.id)

      await updateDoc(habitRef, {
        completedToday: newCompletedState,
        completedDays: newCompletedState ? [...(habit.completedDays || []), new Date()] : habit.completedDays || [],
      })

      // Check if habit has reached its duration
      if (newCompletedState && habit.completedDays && habit.duration) {
        const durationDays = Number.parseInt(habit.duration.split(" ")[0])
        if (habit.completedDays.length >= durationDays - 1) {
          // -1 because we just added today
          setSelectedHabit(habit)
          setCompletionModalVisible(true)
        }
      }
    } catch (error) {
      console.error("Error updating habit completion:", error)
      Alert.alert("Error", "Failed to update habit status")
    }
  }

  const handleLongPress = (habit) => {
    setLongPressedHabit(habit)
  }

  const handleDeletePress = (habit) => {
    setSelectedHabit(habit)

    // Calculate percentage loss
    const percentLoss = habits.length === 1 ? 100 : Math.round(100 / habits.length)
    setSelectedHabit({ ...habit, percentLoss })
    setDeleteModalVisible(true)
  }

  const deleteHabit = async () => {
    if (!selectedHabit) return

    try {
      const db = getFirestore()
      await deleteDoc(doc(db, "habits", selectedHabit.id))

      // Update local state
      setHabits(habits.filter((h) => h.id !== selectedHabit.id))

      // Close modal
      setDeleteModalVisible(false)
      setLongPressedHabit(null)
      setSelectedHabit(null)
    } catch (error) {
      console.error("Error deleting habit:", error)
      Alert.alert("Error", "Failed to delete habit")
    }
  }

  const continueHabitAsLifestyle = async () => {
    if (!selectedHabit) return

    try {
      const db = getFirestore()
      await updateDoc(doc(db, "habits", selectedHabit.id), {
        duration: "Lifestyle",
        isLifestyle: true,
      })

      // Update local state
      setHabits(habits.map((h) => (h.id === selectedHabit.id ? { ...h, duration: "Lifestyle", isLifestyle: true } : h)))

      // Close modal
      setCompletionModalVisible(false)
      setSelectedHabit(null)
    } catch (error) {
      console.error("Error updating habit:", error)
      Alert.alert("Error", "Failed to update habit")
    }
  }

  const letHabitGo = async () => {
    if (!selectedHabit) return

    try {
      const db = getFirestore()
      await updateDoc(doc(db, "habits", selectedHabit.id), {
        active: false,
        completed: true,
        completedAt: new Date(),
      })

      // Update local state
      setHabits(
        habits.map((h) =>
          h.id === selectedHabit.id ? { ...h, active: false, completed: true, completedAt: new Date() } : h,
        ),
      )

      // Close modal
      setCompletionModalVisible(false)
      setSelectedHabit(null)
    } catch (error) {
      console.error("Error updating habit:", error)
      Alert.alert("Error", "Failed to update habit")
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgba(0, 0, 0, 0.6)" />
          <Text style={styles.loadingText}>Loading habits...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>habits</Text>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleHabitCompletion(item)}
              onLongPress={() => handleLongPress(item)}
              delayLongPress={500}
              style={[
                styles.habitCard,
                completedHabits[item.id] && styles.completedHabitCard,
                longPressedHabit?.id === item.id && styles.longPressedHabitCard,
              ]}
            >
              <Text style={[styles.habitText, completedHabits[item.id] && styles.completedHabitText]}>{item.name}</Text>

              {longPressedHabit?.id === item.id ? (
                <TouchableOpacity onPress={() => handleDeletePress(item)} style={styles.deleteIcon}>
                  <Text style={styles.deleteIconText}>✕</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timeText}>{item.time}</Text>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.habitsList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity style={styles.addButton} onPress={addNewHabit}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.lockButton, !allHabitsCompleted && styles.disabledButton]}
            onPress={lockAndViewHaus}
            disabled={!allHabitsCompleted}
          >
            <Text style={[styles.lockButtonText, !allHabitsCompleted && styles.disabledButtonText]}>
              Lock and view haus
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        habitName={selectedHabit?.name}
        percentLoss={selectedHabit?.percentLoss}
        onKeep={() => {
          setDeleteModalVisible(false)
          setLongPressedHabit(null)
          setSelectedHabit(null)
        }}
        onDelete={deleteHabit}
      />

      {/* Completion Modal */}
      <CompletionModal
        visible={completionModalVisible}
        habitName={selectedHabit?.name}
        onContinue={continueHabitAsLifestyle}
        onLetGo={letHabitGo}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(0, 0, 0, 0.6)",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 16,
    marginBottom: 40,
    lineHeight: 38.4,
  },
  habitsList: {
    paddingBottom: 16,
  },
  habitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  completedHabitCard: {
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  longPressedHabitCard: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  habitText: {
    fontSize: 14,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
  },
  completedHabitText: {
    textDecorationLine: "line-through",
    color: "rgba(0, 0, 0, 0.15)",
  },
  timeText: {
    fontSize: 9, // Reduced to 9px as requested
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
  },
  deleteIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconText: {
    fontSize: 14,
    color: "red",
  },
  addButton: {
    marginTop: 8, // Same margin as between habit items
    width: 40, // Square button
    height: 40, // Match the height of habit items
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    alignSelf: "flex-start",
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  bottomContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    paddingBottom: 16,
  },
  lockButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    alignSelf: "flex-end",
  },
  disabledButton: {
    opacity: 0.5,
  },
  lockButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  disabledButtonText: {
    color: "rgba(0, 0, 0, 0.4)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationModal: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    // Two shadows as requested
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    // Second shadow
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmationTitle: {
    fontSize: 20,
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    color: "#000",
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 14,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  keepButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: "#FCFCFC",
    marginRight: 12,
  },
  keepButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#FFFFFF",
  },
})
