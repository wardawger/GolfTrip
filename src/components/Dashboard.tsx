import React, { useState } from 'react';
import { TeamCard } from './TeamCard';
import { ScoreEntry } from './ScoreEntry';
import { ResultsView } from './ResultsView';
import { Team } from '../types';
import { BarChart3, Target, MapPin, Star } from 'lucide-react';

interface DashboardProps {
  currentDay: number;
  teams: Team[];
  getHoleScores: (day: number, hole: number) => any[];
  getAllHoleScores: (day: number) => { [hole: number]: any[] };
  updateHoleScore: (day: number, hole: number, playerId: string, score: any) => void;
}

const courseNames = {
  1: 'Southern Pines Golf Club',
  2: 'Tot Hill Farm Golf Club',
  3: 'Tobacco Road Golf Club'
};

export const Dashboard: React.FC<DashboardProps> = ({
  currentDay,
  teams,
  getHoleScores,
  getAllHoleScores,
  updateHoleScore
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'results'>('teams');

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
        </nav>
      </div>

      {activeTab === 'teams' ? (
        <div>
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Day {currentDay} - {courseNames[currentDay as keyof typeof courseNames]}
              </h2>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
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

          {/* Asterisk Player Rules */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Asterisk Player Rules</span>
            </h3>
            <div className="text-sm text-amber-800">
              <p className="mb-3 font-medium">Applies to: Drew, Dan Y, MJ, Bryan</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">🏌️ Bonus Strokes:</h4>
                  <ul className="space-y-1">
                    <li>• Par 5 holes: 3 bonus strokes</li>
                    <li>• Par 4 holes: 2 bonus strokes</li>
                    <li>• Par 3 holes: 1 bonus stroke</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🔁 Ball Rules:</h4>
                  <ul className="space-y-1">
                    <li>• Playing own ball: keeps all bonus strokes</li>
                    <li>• Playing teammate's ball: costs 1 bonus stroke</li>
                    <li>• Must play own ball once on green</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">➖ Scoring:</h4>
                  <ul className="space-y-1">
                    <li>• Unused bonus strokes are subtracted from gross score</li>
                    <li>• All asterisk players play at scratch handicap</li>
                  </ul>
                </div>
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