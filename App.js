import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from "react-native-toast-message";

// Screens
import SplashScreen from "./screens/SplashScreen";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import { CreateHabitScreen } from "./screens/CreateHabitScreen";
import { HabitListScreen } from "./screens/HabitListScreen";

// Firebase setup
import "./firebaseConfig";

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Toast />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen
            name="CreateHabit"
            component={CreateHabitScreen}
            options={{ title: "Create Habit" }}
          />
          <Stack.Screen
            name="HabitList"
            component={HabitListScreen}
            options={{ title: "Your Habits" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
