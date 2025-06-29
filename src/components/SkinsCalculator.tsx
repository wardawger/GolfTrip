<parameter name="filePath">src/components/SkinsCalculator.tsx</parameter>
import React, { useState, useEffect } from 'react';
import { SkinsPlayer, SkinsGame } from '../types/skins';
import { players as allPlayers } from '../data/players';
import { calculateSkinsGame, getSkinsGameSummary } from '../utils/skinsCalculator';
import { useGameState } from '../hooks/useGameState';
import { DollarSign, Trophy, Users, Calculator, ArrowLeft, Plus, Minus } from 'lucide-react';

interface SkinsCalculatorProps {
  onBack: () => void;
}

export const SkinsCalculator: React.FC<SkinsCalculatorProps> = ({ onBack }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<SkinsPlayer[]>([]);
  const [totalPot, setTotalPot] = useState(200);
  const [selectedDay, setSelectedDay] = useState(1);
  const [skinsGame, setSkinsGame] = useState<SkinsGame | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const { getAllHoleScores } = useGameState();

  const togglePlayer = (player: typeof allPlayers[0]) => {
    const skinsPlayer: SkinsPlayer = {
      id: player.id,
      name: player.name,
      handicap: player.handicap
    };

    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else if (prev.length < 11) {
        return [...prev, skinsPlayer];
      }
      return prev;
    });
  };

  const calculateSkins = () => {
    if (selectedPlayers.length < 2) return;

    const holeScores = getAllHoleScores(selectedDay);
    
    // Convert hole scores to the format expected by skins calculator
    const skinsHoleScores: { [hole: number]: { playerId: string; grossScore: number }[] } = {};
    
    Object.entries(holeScores).forEach(([holeStr, scores]) => {
      const hole = parseInt(holeStr);
      skinsHoleScores[hole] = scores
        .filter(score => selectedPlayers.some(p => p.id === score.playerId))
        .map(score => ({
          playerId: score.playerId,
          grossScore: score.grossScore
        }));
    });

    console.log('Hole scores for skins calculation:', skinsHoleScores);
    console.log('Selected players:', selectedPlayers);

    const game = calculateSkinsGame(selectedPlayers, skinsHoleScores, totalPot, selectedDay);
    setSkinsGame(game);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setSkinsGame(null);
    setShowResults(false);
  };

  // Debug: Show available scores
  const debugHoleScores = getAllHoleScores(selectedDay);
  const hasScores = Object.keys(debugHoleScores).length > 0;

  if (showResults && skinsGame) {
    return <SkinsResults game={skinsGame} onBack={resetCalculator} onMainBack={onBack} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-green-600" />
                <span>Skins Calculator</span>
              </h2>
              <p className="text-gray-600">Track and distribute skins winnings</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Game Setup */}
        <div className="p-6 space-y-6">
          {/* Day Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Day
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>
            
            {/* Debug info */}
            <div className="mt-2 text-sm text-gray-600">
              {hasScores ? (
                <span className="text-green-600">
                  ✓ Scores available for Day {selectedDay} ({Object.keys(debugHoleScores).length} holes with scores)
                </span>
              ) : (
                <span className="text-orange-600">
                  ⚠ No scores found for Day {selectedDay}. Enter scores first in the Score Entry tab.
                </span>
              )}
            </div>
          </div>

          {/* Pot Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Pot ($)
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTotalPot(Math.max(50, totalPot - 50))}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={totalPot}
                onChange={(e) => setTotalPot(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="50"
              />
              <button
                onClick={() => setTotalPot(totalPot + 50)}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="text-sm text-gray-600 ml-4">
                ${(totalPot / 18).toFixed(2)} per hole
              </div>
            </div>
          </div>

          {/* Player Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Players ({selectedPlayers.length}/11)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allPlayers.map(player => {
                const isSelected = selectedPlayers.some(p => p.id === player.id);
                return (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{player.name}</div>
                    <div className="text-xs opacity-75">HCP {player.handicap}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={calculateSkins}
              disabled={selectedPlayers.length < 2 || !hasScores}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedPlayers.length >= 2 && hasScores
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Calculator className="h-5 w-5" />
              <span>Calculate Skins</span>
            </button>
            {selectedPlayers.length >= 2 && !hasScores && (
              <p className="text-sm text-orange-600 mt-2 text-center">
                Please enter scores for Day {selectedDay} first
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SkinsResultsProps {
  game: SkinsGame;
  onBack: () => void;
  onMainBack: () => void;
}

const SkinsResults: React.FC<SkinsResultsProps> = ({ game, onBack, onMainBack }) => {
  const summary = getSkinsGameSummary(game);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Setup</span>
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>{game.name} Results</span>
              </h2>
              <p className="text-gray-600">${game.totalPot} Total Pot</p>
            </div>
            <button
              onClick={onMainBack}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{summary.totalSkins}</div>
              <div className="text-sm text-gray-600">Skins Won</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">${summary.totalEarnings.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Total Paid</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{summary.unclaimedSkins}</div>
              <div className="text-sm text-gray-600">Unclaimed Skins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">${summary.unclaimedValue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Unclaimed Value</div>
            </div>
          </div>
        </div>

        {/* Player Results */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-900">Player</th>
                  <th className="text-center py-3 font-medium text-gray-900">Skins Won</th>
                  <th className="text-center py-3 font-medium text-gray-900">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {summary.playerResults.map((result, index) => (
                  <tr key={result.playerId} className={`border-b border-gray-100 ${result.earnings > 0 ? 'bg-green-50' : ''}`}>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{result.playerName}</span>
                        {result.earnings > 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <span className={`font-semibold ${result.skinsWon > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {result.skinsWon}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className={`font-semibold ${result.earnings > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        ${result.earnings.toFixed(0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hole-by-Hole Results */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hole-by-Hole Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {game.holeResults.map(hole => {
              const winner = hole.winnerId ? game.players.find(p => p.id === hole.winnerId) : null;
              return (
                <div key={hole.hole} className={`p-4 rounded-lg border ${hole.winnerId ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Hole {hole.hole}</span>
                    <span className="text-sm text-gray-600">Par {hole.par}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    {hole.playerScores.length > 0 ? (
                      hole.playerScores
                        .sort((a, b) => a.netScore - b.netScore)
                        .map(score => {
                          const player = game.players.find(p => p.id === score.playerId);
                          const isWinner = score.playerId === hole.winnerId;
                          return (
                            <div key={score.playerId} className={`flex justify-between ${isWinner ? 'font-semibold text-green-700' : 'text-gray-600'}`}>
                              <span>{player?.name}</span>
                              <span>{score.netScore} (gross: {score.grossScore})</span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-gray-500 italic">No scores</div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    {winner ? (
                      <div className="text-green-600 font-medium text-sm">
                        {winner.name} wins ${hole.skinValue.toFixed(0)}
                      </div>
                    ) : (
                      <div className="text-orange-600 font-medium text-sm">
                        Carry over ${hole.skinValue.toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};