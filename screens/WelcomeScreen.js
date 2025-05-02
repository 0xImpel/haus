import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('CreateHabit');
  };

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_400Regular',
    color: '#000',
    marginBottom: 5,
  },
  button: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: '#2A9F85',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});
