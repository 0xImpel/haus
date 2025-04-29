import React, { useState } from 'react';

const HabitList = ({ habits, addHabit, toggleHabit, setView }) => {
  const [newHabit, setNewHabit] = useState('');

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit);
      setNewHabit('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Habits</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit"
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button
          onClick={handleAddHabit}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {habits.map(habit => (
          <li
            key={habit.id}
            className="flex items-center p-2 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(habit.id)}
              className="mr-2"
            />
            <span className={habit.completed ? 'line-through text-gray-500' : ''}>
              {habit.name}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setView('home')}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Back to Home
      </button>
    </div>
  );
};

export default HabitList;