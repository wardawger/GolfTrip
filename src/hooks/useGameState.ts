import { useState, useEffect } from 'react';
import { Round, HoleScore, Team } from '../types';
import { teamPairings } from '../data/teams';
import { courseData, courseDataByDay } from '../data/course';

const STORAGE_KEY = 'golf-scoring-app-data';

interface GameState {
  currentDay: number;
  rounds: Round[];
  holeScores: { [day: number]: { [hole: number]: HoleScore[] } };
  lastSavedScore: { day: number; hole: number; playerId: string } | null;
}

const initialState: GameState = {
  currentDay: 1,
  rounds: [],
  holeScores: {},
  lastSavedScore: null
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState(parsed);
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state to localStorage:', error);
    }
  }, [gameState]);

  const getCurrentDayTeams = () => {
    const dayKey = `day${gameState.currentDay}` as keyof typeof teamPairings;
    return teamPairings[dayKey] || [];
  };

  const updateHoleScore = (day: number, hole: number, playerId: string, score: Partial<HoleScore>) => {
    setGameState(prev => {
      const newState = { ...prev };
      
      if (!newState.holeScores[day]) {
        newState.holeScores[day] = {};
      }
      
      if (!newState.holeScores[day][hole]) {
        newState.holeScores[day][hole] = [];
      }

      const existingScoreIndex = newState.holeScores[day][hole].findIndex(
        s => s.playerId === playerId
      );

      if (existingScoreIndex >= 0) {
        newState.holeScores[day][hole][existingScoreIndex] = {
          ...newState.holeScores[day][hole][existingScoreIndex],
          ...score
        };
      } else {
        newState.holeScores[day][hole].push({
          playerId,
          grossScore: 0,
          netScore: 0,
          bonusStrokesUsed: 0,
          ...score
        });
      }

      // Set the last saved score for notification
      newState.lastSavedScore = { day, hole, playerId };

      return newState;
    });
  };

  const clearLastSavedScore = () => {
    setGameState(prev => ({
      ...prev,
      lastSavedScore: null
    }));
  };

  const getHoleScores = (day: number, hole: number): HoleScore[] => {
    return gameState.holeScores[day]?.[hole] || [];
  };

  const getAllHoleScores = (day: number) => {
    return gameState.holeScores[day] || {};
  };

  const setCurrentDay = (day: number) => {
    setGameState(prev => ({ ...prev, currentDay: day }));
  };

  const resetAllData = () => {
    setGameState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    currentDay: gameState.currentDay,
    lastSavedScore: gameState.lastSavedScore,
    setCurrentDay,
    getCurrentDayTeams,
    updateHoleScore,
    getHoleScores,
    getAllHoleScores,
    resetAllData,
    clearLastSavedScore
  };
};