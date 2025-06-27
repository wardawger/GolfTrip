import { Player, HoleScore, Team, Segment } from '../types';
import { courseData, courseDataByDay } from '../data/course';

export const calculateNetScore = (grossScore: number, handicap: number, holeNumber: number): number => {
  const strokesPerHole = Math.floor(handicap / 18);
  const extraStrokes = handicap % 18;
  const additionalStroke = holeNumber <= extraStrokes ? 1 : 0;
  return grossScore - strokesPerHole - additionalStroke;
};

export const calculateAsteriskBonusStrokes = (holeNumber: number, day: number = 1): number => {
  const courseHoles = courseDataByDay[day as keyof typeof courseDataByDay] || courseData;
  const hole = courseHoles.find(h => h.hole === holeNumber);
  if (!hole) return 0;
  return hole.par === 3 ? 2 : 3;
};

export const calculateAsteriskNetScore = (
  grossScore: number, 
  handicap: number, 
  holeNumber: number, 
  bonusStrokesUsed: number = 0,
  day: number = 1
): number => {
  const regularNetScore = calculateNetScore(grossScore, handicap, holeNumber);
  const bonusStrokes = calculateAsteriskBonusStrokes(holeNumber, day);
  const unusedBonusStrokes = bonusStrokes - bonusStrokesUsed;
  return regularNetScore - unusedBonusStrokes;
};

export const calculateTeamSegmentScore = (
  team: Team, 
  segment: Segment, 
  holeScores: { [holeNumber: number]: HoleScore[] },
  day: number = 1
): number => {
  let totalScore = 0;

  segment.holes.forEach(holeNumber => {
    const holesScores = holeScores[holeNumber] || [];
    const teamPlayerScores = holesScores.filter(score => 
      team.players.some(player => player.id === score.playerId)
    );

    if (teamPlayerScores.length === 0) return;

    // Sort by net score (ascending - lower is better)
    const sortedScores = teamPlayerScores.sort((a, b) => a.netScore - b.netScore);

    if (segment.scoringType === 'best1') {
      totalScore += sortedScores[0]?.netScore || 0;
    } else if (segment.scoringType === 'best2') {
      totalScore += (sortedScores[0]?.netScore || 0) + (sortedScores[1]?.netScore || 0);
    }
  });

  return totalScore;
};

export const findSegmentWinners = (
  teams: Team[], 
  segment: Segment, 
  holeScores: { [holeNumber: number]: HoleScore[] },
  day: number = 1
): { teamIds: string[], score: number } => {
  const teamScores = teams.map(team => ({
    teamId: team.id,
    score: calculateTeamSegmentScore(team, segment, holeScores, day)
  }));

  // Filter out teams with score 0 (incomplete)
  const validScores = teamScores.filter(ts => ts.score > 0);
  
  if (validScores.length === 0) {
    return { teamIds: [], score: 0 };
  }

  const lowestScore = Math.min(...validScores.map(ts => ts.score));
  const winners = validScores.filter(ts => ts.score === lowestScore);
  
  return {
    teamIds: winners.map(w => w.teamId),
    score: lowestScore
  };
};