import React from 'react';

const HomeScreen = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-4">Habit Tracker</h1>
      <p className="text-lg mb-8">Build your habits, brick by brick!</p>
      <button
        onClick={() => setView('habits')}
        className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-200"
      >
        View Habits
      </button>
      <button
        onClick={() => setView('3d')}
        className="mt-4 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-200"
      >
        View 3D House
      </button>
    </div>
  );
};

export default HomeScreen;