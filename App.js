"use client"

import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Toast from "react-native-toast-message"

// Import firebase configuration
import { auth } from "./firebaseConfig"

// Screens
import SplashScreen from "./screens/SplashScreen"
import Signup from "./screens/Signup"
import Signin from "./screens/Signin"
import { CreateHabitScreen } from "./screens/CreateHabitScreen"
import { HabitListScreen } from "./screens/HabitListScreen"

const Stack = createStackNavigator()

const App = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)

  useEffect(() => {
    // Add a small delay to ensure Firebase is fully initialized
    const initTimeout = setTimeout(() => {
      console.log("Firebase auth initialized:", auth != null)
      setIsFirebaseReady(true)
    }, 1000)

    return () => clearTimeout(initTimeout)
  }, [])

  if (!isFirebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Initializing app...</Text>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Toast />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="CreateHabit" component={CreateHabitScreen} options={{ title: "Create Habit" }} />
        <Stack.Screen name="HabitList" component={HabitListScreen} options={{ title: "Your Habits" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App