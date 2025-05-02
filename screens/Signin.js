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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

const auth = getAuth(app);

const Signin = ({ route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const [errors, setErrors] = useState({ email: "", password: "" });
  const params = route.params;
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      return false;
    } else if (!emailPattern.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        navigation.navigate("CreateHabit");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.containers}>
            <Text style={styles.signinTitle}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onBlur={() => validateEmail(email)}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword} // Conditionally hide/show the password
                onBlur={() => validatePassword(password)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)} // Toggle visibility
              >
                <Icon
                  name={showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#808080"
                />
              </TouchableOpacity>
            </View>

            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Text style={styles.ForgotPass}>Forgot Password?</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.footerTextWrapper}>
              <Text style={styles.footer}>
                New here?
                <Text style={styles.Create} onPress={navigateToSignUp}>
                  {" "}
                  Create an account
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containers: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  signinTitle: {
    fontSize: 25,
    marginTop: 120,
    fontWeight: "500",
    fontFamily: "Poppins_900Bold",
    color: "#808080",
    marginBottom: 25,
  },
  ForgotPass: {
    fontSize: 14,
    color: "#808080",
    left: 8,
    fontFamily: "Poppins",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
    alignSelf: "flex-start",
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
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    alignSelf: "flex-end",
    marginRight: 20,
  },
  continueButtonText: {
    color: "#808080",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  footerContainer: {
    position: "absolute",
    bottom: 40,
    top: 700,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  footerTextWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
  },
  footer: {
    color: "#808080",
  },
  Create: {
    color: "#000000",
    fontFamily: "Poppins",
  },
});

export default Signin;
