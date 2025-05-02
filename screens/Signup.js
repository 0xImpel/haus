import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validateFields = () => {
    let valid = true;
    let newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Please enter a valid email.";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateAccount = async () => {
    if (!validateFields()) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("CreateHabit"); 
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };
  const navigateToSignIn = () => {
    navigation.navigate("Signin");
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              value={firstName}
              onChangeText={setFirstName}
            />
            {errors.firstName && (
              <Text style={styles.error}>{errors.firstName}</Text>
            )}

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              value={lastName}
              onChangeText={setLastName}
            />
            {errors.lastName && (
              <Text style={styles.error}>{errors.lastName}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="johndoe@outlook.de"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateAccount}
            >
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontWeight: "600",
    color: "#808080",
    marginBottom: 30,
    fontFamily: "Poppins_900Bold",
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    fontFamily: "Poppins",
    width: "100%",
    height: 53,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderColor: "#ddd",
  },
  error: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#fff",
    borderColor: "#D3D3D3",
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "flex-end", // align to right
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  createButtonText: {
    color: "#808080",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },

  footerLine: {
    marginTop: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    alignItems: "center",
    width: "65%", // or adjust
    alignSelf: "center",
  },

  Create: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#000000",
  },
  login: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#000000",
    fontWeight: "600",
  },
});

export default Signup;
