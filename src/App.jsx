import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import HabitList from './components/HabitList';
import ThreeScene from './components/ThreeScene';

const App = () => {
  const [view, setView] = useState('home');
  const [habits, setHabits] = useState([]);

  const addHabit = (habit) => {
    setHabits([...habits, { id: Date.now(), name: habit, completed: false }]);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'home' && (
        <HomeScreen setView={setView} />
      )}
      {view === 'habits' && (
        <HabitList
          habits={habits}
          addHabit={addHabit}
          toggleHabit={toggleHabit}
          setView={setView}
        />
      )}
      {view === '3d' && (
        <ThreeScene habits={habits} setView={setView} />
      )}
    </div>
  );
};

export default App;