import React from 'react';
import { Trophy, Calendar } from 'lucide-react';

interface HeaderProps {
  currentDay: number;
  onDayChange: (day: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDay, onDayChange }) => {
  return (
    <div className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold">The Web</h1>
                <p className="text-green-200">Golf Tournament Scoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-200" />
              <div className="flex space-x-1">
                {[1, 2, 3].map(day => (
                  <button
                    key={day}
                    onClick={() => onDayChange(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentDay === day
                        ? 'bg-white text-green-800 shadow-md'
                        : 'bg-green-700 text-white hover:bg-green-600'
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};