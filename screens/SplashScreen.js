import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('Signin');
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
    fontWeight: '500',
    fontFamily: 'Poppins_900Bold',
    color: '#000',
    marginBottom: 5,
  },
  button: {
    marginTop: 50,
    left: 220,
    top: 190,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  buttonText: {
    color: '#808080',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});
