// 📱 screens/HausScreen.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Progress from 'react-native-progress';

export function HausScreen() {
  const placedBricks = 9;
  const totalBricks = 21;
  const progress = placedBricks / totalBricks;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>haus</Text>

      <Image
        source={require('../assets/images/LogoHabitTracking.png')} // your image path
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.progressLabel}>Foundation</Text>

      <Progress.Bar
        progress={progress}
        width={null}            // full width
        style={styles.progressBar}
        borderRadius={5}
        unfilledColor="#eee"
        color="#2A9F85"
      />

      <Text style={styles.progressText}>
        {`${placedBricks} of ${totalBricks} bricks placed`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  progressLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  progressBar: {
    height: 10,
    width: '100%',
    marginVertical: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
    alignSelf: 'flex-start',
  },
});
