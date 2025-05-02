import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Signup");
    }, 1000);
  }, [navigation]);

  return (
    <View style={styles.splashScreen}>
      <Image
        source={require("../assets/images/LogoHabitTrackingApp.png")}
        style={styles.logo}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  splashScreen: {
    backgroundColor: "#2A9F85",
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
  },
  logo: {
    height: 180,
    width: "38%",
    top: "40.38%",
    right: "32.5%",
    bottom: "49.99%",
    left: "30.5%",
    maxWidth: "100%",
    maxHeight: "100%",
  },
});
