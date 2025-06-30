import React, { useState, useEffect } from 'react';
import { Team, Player, HoleScore } from '../types';
import { courseDataByDay } from '../data/course';
import { calculatePlayerNetScore, calculateAsteriskBonusStrokes } from '../utils/scoring';
import { ArrowLeft, Save, Star } from 'lucide-react';

interface ScoreEntryProps {
  team: Team;
  day: number;
  onBack: () => void;
  getHoleScores: (day: number, hole: number) => HoleScore[];
  updateHoleScore: (day: number, hole: number, playerId: string, score: Partial<HoleScore>) => void;
}

export const ScoreEntry: React.FC<ScoreEntryProps> = ({
  team,
  day,
  onBack,
  getHoleScores,
  updateHoleScore
}) => {
  const [selectedHole, setSelectedHole] = useState(1);
  const [scores, setScores] = useState<{ [playerId: string]: { gross: string, bonusUsed: string } }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load existing scores for the selected hole
    const holeScores = getHoleScores(day, selectedHole);
    const newScores: { [playerId: string]: { gross: string, bonusUsed: string } } = {};
    
    team.players.forEach(player => {
      const existingScore = holeScores.find(s => s.playerId === player.id);
      newScores[player.id] = {
        gross: existingScore?.grossScore.toString() || '',
        bonusUsed: existingScore?.bonusStrokesUsed?.toString() || '0'
      };
    });
    
    setScores(newScores);
  }, [selectedHole, team.players, getHoleScores, day]);

  const getCurrentHole = () => {
    const courseHoles = courseDataByDay[day as keyof typeof courseDataByDay] || [];
    return courseHoles.find(h => h.hole === selectedHole)!;
  };

  const handleScoreChange = (playerId: string, field: 'gross' | 'bonusUsed', value: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }));
  };

  const saveScores = () => {
    setIsSaving(true);
    
    team.players.forEach(player => {
      const playerScore = scores[player.id];
      if (playerScore?.gross && !isNaN(Number(playerScore.gross))) {
        const grossScore = Number(playerScore.gross);
        const bonusUsed = player.isAsterisk ? Number(playerScore.bonusUsed) || 0 : 0;
        const netScore = calculatePlayerNetScore(player, grossScore, selectedHole, bonusUsed, day);
        
        updateHoleScore(day, selectedHole, player.id, {
          playerId: player.id,
          grossScore,
          netScore,
          bonusStrokesUsed: bonusUsed
        });
      }
    });
    
    // Reset saving state after a short delay to show feedback
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const getMaxBonusStrokes = () => calculateAsteriskBonusStrokes(selectedHole, day);

  const currentHole = getCurrentHole();

  // Save button component to avoid duplication
  const SaveButton = ({ className = "" }: { className?: string }) => (
    <button
      onClick={saveScores}
      className={`flex items-center space-x-2 ${
        isSaving 
          ? "bg-green-500 text-white" 
          : "bg-green-600 text-white hover:bg-green-700"
      } px-4 py-2 rounded-lg transition-colors ${className}`}
      disabled={isSaving}
    >
      <Save className="h-4 w-4" />
      <span>{isSaving ? "Saved!" : "Save"}</span>
    </button>
  );

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
              <span>Back to Teams</span>
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>
              <p className="text-gray-600">Day {day} Scoring</p>
            </div>
            <SaveButton />
          </div>
        </div>

        {/* Hole Selection */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-18 gap-2">
            {courseDataByDay[day as keyof typeof courseDataByDay]?.map(hole => (
              <button
                key={hole.hole}
                onClick={() => setSelectedHole(hole.hole)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedHole === hole.hole
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <div>{hole.hole}</div>
                <div className="text-xs opacity-75">Par {hole.par}</div>
                {'handicap' in hole && (
                  <div className="text-xs opacity-60">HCP {hole.handicap}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Score Entry */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hole {selectedHole} - Par {currentHole.par}
              {'handicap' in currentHole && (
                <span className="text-sm text-gray-600 ml-2">(Handicap {currentHole.handicap})</span>
              )}
            </h3>
          </div>

          <div className="space-y-4">
            {team.players.map(player => {
              const playerScore = scores[player.id] || { gross: '', bonusUsed: '0' };
              const grossScore = Number(playerScore.gross) || 0;
              const bonusUsed = Number(playerScore.bonusUsed) || 0;
              const netScore = grossScore > 0 ? calculatePlayerNetScore(player, grossScore, selectedHole, bonusUsed, day) : 0;
              const maxBonus = getMaxBonusStrokes();

              // Check if this player is playing at scratch
              const scratchPlayers = ['Drew', 'Dan Y', 'MJ', 'Bryan'];
              const isPlayingScratch = scratchPlayers.includes(player.name);

              return (
                <div key={player.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{player.name}</span>
                      {player.isAsterisk && <Star className="h-4 w-4 text-amber-500" />}
                      <span className="text-sm text-gray-500">
                        HCP {player.handicap}
                        {isPlayingScratch && (
                          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                            (Playing Scratch)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Net Score: <span className="font-semibold">{netScore || '-'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gross Score
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={playerScore.gross}
                        onChange={(e) => handleScoreChange(player.id, 'gross', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter score"
                      />
                    </div>

                    {player.isAsterisk && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bonus Strokes Used
                        </label>
                        <select
                          value={playerScore.bonusUsed}
                          onChange={(e) => handleScoreChange(player.id, 'bonusUsed', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          {Array.from({ length: maxBonus + 1 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Max {maxBonus} bonus strokes available
                        </p>
                      </div>
                    )}

                    <div className="flex items-end">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Net Score</div>
                        <div className="text-2xl font-bold text-green-600">
                          {netScore || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <SaveButton />
          </div>
        </div>
      </div>
    </div>
  );
};