"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export function HabitListScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [isLoading, setIsLoading] = useState(true)

  // Get habits from route params or use default habits
  const [habits, setHabits] = useState(route.params?.habits || [])

  // Fetch habits from Firebase when component mounts
  useEffect(() => {
    fetchHabitsFromFirebase()
  }, [])

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
      querySnapshot.forEach((doc) => {
        fetchedHabits.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      // If we have habits from Firebase, use those
      if (fetchedHabits.length > 0) {
        setHabits(fetchedHabits)
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
    // Navigate to the Haus view or implement locking functionality
    console.log("Lock and view haus")
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
        <Text style={styles.skipText}>Skip</Text>

        <Text style={styles.title}>habits</Text>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.habitCard}>
              <Text style={styles.habitText}>{item.name}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
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
          <TouchableOpacity style={styles.lockButton} onPress={lockAndViewHaus}>
            <Text style={styles.lockButtonText}>Lock and view haus</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  skipText: {
    alignSelf: "flex-end",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 8,
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
  habitText: {
    fontSize: 14,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
  },
  timeText: {
    fontSize: 14,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
  },
  addButton: {
    marginTop: 10,
    width: 40,
    height: 40,
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
    fontSize: 20,
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
  lockButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.6)",
  },
})
