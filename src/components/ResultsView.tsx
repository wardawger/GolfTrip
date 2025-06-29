import React from 'react';
import { Team } from '../types';
import { segments, payoutSegments } from '../data/course';
import { calculateTeamSegmentScore, findSegmentWinners } from '../utils/scoring';
import { Trophy, DollarSign, MapPin } from 'lucide-react';

interface ResultsViewProps {
  day: number;
  teams: Team[];
  getAllHoleScores: (day: number) => { [hole: number]: any[] };
}

const getCourseInfo = (day: number) => {
  const courseNames = {
    1: 'Southern Hills',
    2: 'Tot Hill Farm', 
    3: 'Tobacco Road'
  };
  return courseNames[day as keyof typeof courseNames] || 'Unknown Course';
};

export const ResultsView: React.FC<ResultsViewProps> = ({ day, teams, getAllHoleScores }) => {
  const holeScores = getAllHoleScores(day);

  const getPayoutSegmentResults = () => {
    return payoutSegments.map(payoutSegment => {
      // Find all mini-segments that belong to this payout segment
      const relevantSegments = segments.filter(segment => 
        segment.holes.every(hole => payoutSegment.holes.includes(hole))
      );

      // Calculate total score for each team across all relevant segments
      const teamTotals = teams.map(team => {
        const totalScore = relevantSegments.reduce((total, segment) => {
          return total + calculateTeamSegmentScore(team, segment, holeScores);
        }, 0);

        return {
          team,
          score: totalScore,
          hasScores: totalScore > 0
        };
      });

      // Find winners (lowest score among teams with scores)
      const teamsWithScores = teamTotals.filter(t => t.hasScores);
      if (teamsWithScores.length === 0) {
        return {
          segment: payoutSegment,
          teamTotals,
          winners: [],
          winningScore: 0,
          payoutPerWinner: 0
        };
      }

      const winningScore = Math.min(...teamsWithScores.map(t => t.score));
      const winners = teamsWithScores.filter(t => t.score === winningScore);
      const payoutPerWinner = payoutSegment.payout / winners.length;

      return {
        segment: payoutSegment,
        teamTotals,
        winners,
        winningScore,
        payoutPerWinner
      };
    });
  };

  const segmentResults = getPayoutSegmentResults();
  const totalPayout = segmentResults.reduce((total, result) => 
    total + (result.winners.length > 0 ? result.segment.payout : 0), 0
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Day {day} Results</h2>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{getCourseInfo(day)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {segmentResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {result.segment.name}
                </h3>
                <div className="flex items-center space-x-2 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">${result.segment.payout}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-900">Team</th>
                      <th className="text-center py-2 font-medium text-gray-900">Score</th>
                      <th className="text-center py-2 font-medium text-gray-900">Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.teamTotals
                      .sort((a, b) => {
                        if (!a.hasScores && !b.hasScores) return 0;
                        if (!a.hasScores) return 1;
                        if (!b.hasScores) return -1;
                        return a.score - b.score;
                      })
                      .map((teamTotal, teamIndex) => {
                        const isWinner = result.winners.some(w => w.team.id === teamTotal.team.id);
                        return (
                          <tr 
                            key={teamTotal.team.id} 
                            className={`border-b border-gray-100 ${isWinner ? 'bg-green-50' : ''}`}
                          >
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{teamTotal.team.name}</span>
                                {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                              </div>
                              <div className="text-sm text-gray-600">
                                {teamTotal.team.players.map(p => p.name).join(', ')}
                              </div>
                            </td>
                            <td className="text-center py-3">
                              <span className={`font-semibold ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
                                {teamTotal.hasScores ? teamTotal.score : '-'}
                              </span>
                            </td>
                            <td className="text-center py-3">
                              {isWinner && (
                                <span className="font-semibold text-green-600">
                                  ${result.payoutPerWinner.toFixed(0)}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total Payouts:</span>
            <span className="text-2xl font-bold text-green-600">${totalPayout}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Remaining for Skins: ${900 - totalPayout}
          </div>
        </div>
      </div>
    </div>
  );
};