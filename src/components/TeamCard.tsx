import React from 'react';
import { Team } from '../types';
import { Users, Star } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
        <Users className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="space-y-2">
        {team.players.map(player => (
          <div key={player.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                player.isAsterisk ? 'text-amber-600' : 'text-gray-700'
              }`}>
                {player.name}
                {player.isAsterisk && <Star className="inline h-3 w-3 ml-1 text-amber-500" />}
              </span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              HCP {player.handicap}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};