import React, { useState } from 'react';
import { TeamCard } from './TeamCard';
import { ScoreEntry } from './ScoreEntry';
import { ResultsView } from './ResultsView';
import { SkinsCalculator } from './SkinsCalculator';
import { Team } from '../types';
import { BarChart3, Target, Calculator } from 'lucide-react';

interface DashboardProps {
  currentDay: number;
  teams: Team[];
  getHoleScores: (day: number, hole: number) => any[];
  getAllHoleScores: (day: number) => { [hole: number]: any[] };
  updateHoleScore: (day: number, hole: number, playerId: string, score: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentDay,
  teams,
  getHoleScores,
  getAllHoleScores,
  updateHoleScore
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'results' | 'skins'>('teams');

  if (selectedTeam) {
    return (
      <ScoreEntry
        team={selectedTeam}
        day={currentDay}
        onBack={() => setSelectedTeam(null)}
        getHoleScores={getHoleScores}
        updateHoleScore={updateHoleScore}
      />
    );
  }

  if (activeTab === 'skins') {
    return (
      <SkinsCalculator
        onBack={() => setActiveTab('teams')}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'teams'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Score Entry</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'results'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Results & Payouts</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('skins')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'skins'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Skins Calculator</span>
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'teams' ? (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Day {currentDay} Teams</h2>
            <p className="text-gray-600">Select a team to enter scores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onClick={() => setSelectedTeam(team)}
              />
            ))}
          </div>

          {/* Game Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Game Format Reminder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Scoring by Holes:</h4>
                <ul className="space-y-1">
                  <li>• Holes 1-3, 7-9, 13-15: Best 1 net score</li>
                  <li>• Holes 4-6, 10-12, 16-18: Best 2 net scores</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Payouts:</h4>
                <ul className="space-y-1">
                  <li>• Holes 1-6 winner: $100</li>
                  <li>• Holes 7-12 winner: $100</li>
                  <li>• Holes 13-18 winner: $100</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ResultsView
          day={currentDay}
          teams={teams}
          getAllHoleScores={getAllHoleScores}
        />
      )}
    </div>
  );
};