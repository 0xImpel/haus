"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

export default function SignupScreen() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const navigation = useNavigation()
  const auth = getAuth()

  const validateFields = () => {
    let valid = true
    const newErrors = {}

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required."
      valid = false
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required."
      valid = false
    }
    if (!email.trim()) {
      newErrors.email = "Email is required."
      valid = false
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Please enter a valid email."
      valid = false
    }
    if (!password.trim()) {
      newErrors.password = "Password is required."
      valid = false
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleCreateAccount = async () => {
    if (!validateFields()) return

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      Alert.alert("Success", "Account created successfully!")
      navigation.navigate("CreateHabit")
    } catch (error) {
      console.log(error)
      Alert.alert("Error", error.message)
    }
  }

  const navigateToSignIn = () => {
    navigation.navigate("Signin")
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              value={firstName}
              onChangeText={setFirstName}
            />
            {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              value={lastName}
              onChangeText={setLastName}
            />
            {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="johndoe@outlook.de"
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="rgba(0, 0, 0, 0.25)"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>
            <View style={styles.footerLine}>
              <Text style={styles.Create}>
                Already have an account?{" "}
                <Text onPress={navigateToSignIn} style={styles.login}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },
  scrollViewContainer: {
    padding: 22,
    paddingTop: 50,
    paddingBottom: 80,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
    marginBottom: 30,
    fontFamily: "Inter-Regular",
    lineHeight: 38.4,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter-Light",
    fontWeight: "300",
    color: "rgba(0, 0, 0, 0.6)",
    marginBottom: 10,
  },
  input: {
    fontFamily: "Inter",
    width: "100%",
    height: 53,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    // Removed shadows as requested
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)", // Black with 15% opacity as requested
    color: "rgba(0, 0, 0, 0.6)", // Black with 60% opacity as requested
  },
  error: {
    color: "red",
    fontSize: 12,
    fontFamily: "Inter",
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#FCFCFC",
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  createButtonText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Inter-Regular",
    fontSize: 16,
    fontWeight: "400",
  },
  footerLine: {
    marginTop: 80,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.15)",
    alignItems: "center",
    width: "65%",
    alignSelf: "center",
  },
  Create: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "rgba(0, 0, 0, 0.6)",
  },
  login: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#000000",
    fontWeight: "400",
  },
})
