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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

const Signin = ({ route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const params = route.params;
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      return false;
    } else if (!emailPattern.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleContinue = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        navigation.navigate("WelcomeScreen");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate("Signup", params);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Image
                source={require("../assets/images/LogoHabitTracking.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.signinTitle}>Sign In</Text>
            </View>

            <Text style={styles.subtitle}>Welcome back! Sign in to your account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onBlur={() => validateEmail(email)}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onBlur={() => validatePassword(password)}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
              Don’t have an account?
              <Text style={styles.signupText} onPress={navigateToSignUp}> Sign Up</Text>
            </Text>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 20 },
  header: { alignItems: "center", justifyContent: "center" },
  logo: {
    width: 150,
    height: 150,
    marginTop: 35,
    marginBottom: -10,
  },
  signinTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  input: {
    fontFamily: "Poppins",
    width: "100%",
    height: 53,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: "#2A9F85",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  footer: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 15,
    fontFamily: "Poppins",
  },
  signupText: {
    color: "#2A9F85",
    fontFamily: "Poppins",
  },
});

export default Signin;
