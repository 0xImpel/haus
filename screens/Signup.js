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
  Image, // added this
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const Signup = ({ route }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const params = route.params;
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigation = useNavigation();

  const validateFullName = (name) => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, fullName: "Please enter your full name." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, fullName: "" }));
    return true;
  };

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

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required." }));
      return false;
    } else if (phone.length !== 11) {
      setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 11 digits." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
      return false;
    } else if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleContinue = async () => {
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const userType = params.data.selectedUser;
        await setDoc(doc(db, userType, user.uid), {
          fullName: fullName,
          phone: phone,
          email: email,
          createdAt: new Date(),
        });
        navigation.navigate("WelcomeScreen");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "User already exists or invalid details.");
    }
  };

  const navigateToSignIn = () => { navigation.navigate("Signin", params); };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Image
                source={require("../assets/images/LogoHabitTracking.png")} // update path as needed
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.signupTitle}>Sign Up</Text>
            </View>

            <Text style={styles.subtitle}>Welcome! Create a new account</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => validateFullName(fullName)}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

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
              placeholder="Phone"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onBlur={() => validatePhone(phone)}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

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
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
              Already have an account?
              <Text style={styles.loginText} onPress={navigateToSignIn}> Log In</Text>
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
  signupTitle: {
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
  loginText: {
    color: "#2A9F85",
    fontFamily: "Poppins",
  },
});

export default Signup;
