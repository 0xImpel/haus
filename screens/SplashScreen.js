import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function SplashScreen() {
  const navigation = useNavigation()

  const handleStart = () => {
    navigation.navigate("Signin")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consistent growth</Text>
      <Text style={styles.title}>Healthy habits</Text>
      <Text style={styles.title}>No fluff</Text>
      <Text style={styles.title}>haus</Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#FCFCFC",
  },
  title: {
    fontSize: 32, // Updated to 32px (2rem)
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    color: "#000",
    marginBottom: 5,
    lineHeight: 38.4, // Kept as requested
  },
  button: {
    marginTop: 50,
    left: 220,
    top: 190,
    backgroundColor: "#FCFCFC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Inter-Regular",
    fontSize: 16,
    fontWeight: "400",
  },
})
