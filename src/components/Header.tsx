import React from 'react';
import { Trophy, Calendar } from 'lucide-react';

interface HeaderProps {
  currentDay: number;
  onDayChange: (day: number) => void;
}

const courseNames = {
  1: 'Southern Pines Golf Club',
  2: 'Tot Hill Farm Golf Club',
  3: 'Tobacco Road Golf Club'
};

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
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-green-200">Currently Playing</div>
                <div className="font-semibold text-white">
                  {courseNames[currentDay as keyof typeof courseNames]}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-200" />
                <div className="flex space-x-1">
                  {[1, 2, 3].map(day => (
                    <button
                      key={day}
                      onClick={() => onDayChange(day)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-center ${
                        currentDay === day
                          ? 'bg-white text-green-800 shadow-md'
                          : 'bg-green-700 text-white hover:bg-green-600'
                      }`}
                      title={courseNames[day as keyof typeof courseNames]}
                    >
                      <div className="text-sm">Day {day}</div>
                      <div className="text-xs opacity-75 hidden lg:block">
                        {courseNames[day as keyof typeof courseNames].split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile course name display */}
          <div className="mt-3 sm:hidden">
            <div className="text-center">
              <div className="text-sm text-green-200">Currently Playing</div>
              <div className="font-semibold text-white">
                {courseNames[currentDay as keyof typeof courseNames]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};