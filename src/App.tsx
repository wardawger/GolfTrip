import React from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { useGameState } from './hooks/useGameState';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {
    currentDay,
    setCurrentDay,
    getCurrentDayTeams,
    updateHoleScore,
    getHoleScores,
    getAllHoleScores,
    lastSavedScore,
    clearLastSavedScore
  } = useGameState();

  const teams = getCurrentDayTeams();

  // Show notification when a score is saved
  React.useEffect(() => {
    if (lastSavedScore) {
      toast.success(`Score saved for Hole ${lastSavedScore.hole}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Clear the last saved score after showing the notification
      clearLastSavedScore();
    }
  }, [lastSavedScore, clearLastSavedScore]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentDay={currentDay} onDayChange={setCurrentDay} />
      <main className="py-8">
        <Dashboard
          currentDay={currentDay}
          teams={teams}
          getHoleScores={getHoleScores}
          getAllHoleScores={getAllHoleScores}
          updateHoleScore={updateHoleScore}
        />
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;