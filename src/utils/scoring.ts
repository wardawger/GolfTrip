import { Player, HoleScore, Team, Segment } from '../types';
import { courseData, courseDataByDay } from '../data/course';

export const calculateNetScore = (grossScore: number, handicap: number, holeNumber: number, day: number = 1): number => {
  const courseHoles = courseDataByDay[day as keyof typeof courseDataByDay] || courseData;
  const hole = courseHoles.find(h => h.hole === holeNumber);
  const holeHandicap = hole && 'handicap' in hole ? hole.handicap : holeNumber;
  
  const strokesPerHole = Math.floor(handicap / 18);
  const extraStrokes = handicap % 18;
  const additionalStroke = holeHandicap <= extraStrokes ? 1 : 0;
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
  const regularNetScore = calculateNetScore(grossScore, handicap, holeNumber, day);
  const bonusStrokes = calculateAsteriskBonusStrokes(holeNumber, day);
  const unusedBonusStrokes = bonusStrokes - bonusStrokesUsed;
  return regularNetScore - unusedBonusStrokes;
};

// New function to calculate the final score for team calculations
export const calculateFinalScore = (player: Player, grossScore: number, bonusStrokesUsed: number = 0, holeNumber: number, day: number = 1): number => {
  // Designated players (Drew, Dan Y, MJ, Bryan) use gross scores only
  const designatedPlayers = ['Drew', 'Dan Y', 'MJ', 'Bryan'];
  
  if (designatedPlayers.includes(player.name)) {
    // For designated players, return gross score minus any unused bonus strokes
    if (player.isAsterisk) {
      const bonusStrokes = calculateAsteriskBonusStrokes(holeNumber, day);
      const unusedBonusStrokes = bonusStrokes - bonusStrokesUsed;
      return grossScore - unusedBonusStrokes;
    }
    return grossScore;
  }
  
  // For all other players, use standard net scoring
  if (player.isAsterisk) {
    return calculateAsteriskNetScore(grossScore, player.handicap, holeNumber, bonusStrokesUsed, day);
  }
  return calculateNetScore(grossScore, player.handicap, holeNumber, day);
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
    ).map(score => {
      // Find the player to get their information
      const player = team.players.find(p => p.id === score.playerId);
      if (!player) return score;
      
      // Calculate the final score using the new logic
      const finalScore = calculateFinalScore(
        player, 
        score.grossScore, 
        score.bonusStrokesUsed || 0, 
        holeNumber, 
        day
      );
      
      return {
        ...score,
        netScore: finalScore // Override netScore with final calculated score
      };
    });

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