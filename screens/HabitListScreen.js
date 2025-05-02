import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const habits = [
  { id: '1', title: 'I will Train BJJ', time: '45min' },
  { id: '2', title: 'i will learn Science', time: '30min' },
];

export function HabitListScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>habits</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.title}</Text>
            <Text>{item.time}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateHabit')}>
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Poppins",
    marginBottom: 10,
    marginTop: 35,
  },
  card: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    fontFamily: 'Poppins_400Regular',
  },
  addButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  addText: {
    color: '#808080',
    fontWeight: '400',
    fontSize: 16,
  },
});

