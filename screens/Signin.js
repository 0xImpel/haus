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
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SigninScreen({ route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const params = route?.params;
  const navigation = useNavigation();
  const auth = getAuth();

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={styles.signinTitle}>Login</Text>

              <TextInput
                style={styles.input}
                placeholder="Email or Username"
                placeholderTextColor="rgba(0, 0, 0, 0.6)"
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
                  placeholderTextColor="rgba(0, 0, 0, 0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onBlur={() => validatePassword(password)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Icon
                    name={showPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="rgba(0, 0, 0, 0.6)"
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      {/* Footer placed outside KeyboardAvoidingView to prevent it from moving with keyboard */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  signinTitle: {
    fontSize: 25,
    marginTop: 120,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
    color: "#000",
    marginBottom: 25,
    lineHeight: 38.4,
  },
  ForgotPass: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
    left: 8,
    fontFamily: "Inter",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.6)",
    alignSelf: "flex-start",
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
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderColor: "rgba(0, 0, 0, 0.15)",
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
    fontFamily: "Inter",
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: "#FCFCFC",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    alignSelf: "flex-end",
    marginRight: 20,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  continueButtonText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Inter-Regular",
    fontSize: 16,
    fontWeight: "400",
  },
  footerContainer: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#FCFCFC',
  },
  footerTextWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.6)",
  },
  footer: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Inter",
  },
  Create: {
    color: "#000000",
    fontFamily: "Inter",
    fontWeight: "400",
  },
});