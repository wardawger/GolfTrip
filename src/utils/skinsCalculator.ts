import { SkinsPlayer, SkinsHoleResult, SkinsGame } from '../types/skins';
import { courseDataByDay } from '../data/course';
import { calculateNetScore } from './scoring';

export const calculateSkinsNetScore = (
  grossScore: number,
  handicap: number,
  holeNumber: number,
  day: number,
  playerName?: string
): number => {
  // Designated players (Drew, Dan Y, MJ, Bryan) use gross scores only for skins
  const designatedPlayers = ['Drew', 'Dan Y', 'MJ', 'Bryan'];
  
  if (playerName && designatedPlayers.includes(playerName)) {
    return grossScore;
  }
  
  return calculateNetScore(grossScore, handicap, holeNumber, day);
};

export const determineHoleWinner = (
  holeResult: SkinsHoleResult
): { winnerId: string | null; isCarryover: boolean } => {
  if (holeResult.playerScores.length === 0) {
    return { winnerId: null, isCarryover: true };
  }

  // Sort by net score (ascending - lower is better)
  const sortedScores = [...holeResult.playerScores].sort((a, b) => a.netScore - b.netScore);
  
  // Check if there's a tie for the lowest score
  const lowestScore = sortedScores[0].netScore;
  const playersWithLowestScore = sortedScores.filter(score => score.netScore === lowestScore);
  
  if (playersWithLowestScore.length > 1) {
    // Tie - no winner, carry over
    return { winnerId: null, isCarryover: true };
  }
  
  // Single winner
  return { winnerId: playersWithLowestScore[0].playerId, isCarryover: false };
};

export const calculateSkinsGame = (
  players: SkinsPlayer[],
  holeScores: { [hole: number]: { playerId: string; grossScore: number }[] },
  totalPot: number,
  day: number
): SkinsGame => {
  const courseHoles = courseDataByDay[day as keyof typeof courseDataByDay] || [];
  const skinValuePerHole = totalPot / 18;
  
  const holeResults: SkinsHoleResult[] = [];
  let carryoverValue = 0;
  const playerEarnings: { [playerId: string]: number } = {};
  const playerSkins: { [playerId: string]: number } = {};
  
  // Initialize player earnings and skins
  players.forEach(player => {
    playerEarnings[player.id] = 0;
    playerSkins[player.id] = 0;
  });
  
  // Process each hole
  for (let holeNum = 1; holeNum <= 18; holeNum++) {
    const holeData = courseHoles.find(h => h.hole === holeNum);
    const holeScoreData = holeScores[holeNum] || [];
    
    // Calculate net scores for this hole
    const playerScores = holeScoreData
      .filter(score => players.some(p => p.id === score.playerId))
      .map(score => {
        const player = players.find(p => p.id === score.playerId)!;
        const netScore = calculateSkinsNetScore(score.grossScore, player.handicap, holeNum, day, player.name);
        return {
          playerId: score.playerId,
          grossScore: score.grossScore,
          netScore
        };
      });
    
    const currentSkinValue = skinValuePerHole + carryoverValue;
    
    const holeResult: SkinsHoleResult = {
      hole: holeNum,
      par: holeData?.par || 4,
      handicap: (holeData && 'handicap' in holeData) ? holeData.handicap : holeNum,
      playerScores,
      winnerId: null,
      skinValue: currentSkinValue,
      isCarryover: false
    };
    
    const { winnerId, isCarryover } = determineHoleWinner(holeResult);
    
    holeResult.winnerId = winnerId;
    holeResult.isCarryover = isCarryover;
    
    if (winnerId && !isCarryover) {
      // Award the skin
      playerEarnings[winnerId] += currentSkinValue;
      playerSkins[winnerId] += 1;
      carryoverValue = 0;
    } else {
      // Carry over to next hole
      carryoverValue += skinValuePerHole;
    }
    
    holeResults.push(holeResult);
  }
  
  const game: SkinsGame = {
    id: `skins-${Date.now()}`,
    name: `Day ${day} Skins`,
    players,
    totalPot,
    skinValuePerHole,
    day,
    holeResults,
    playerEarnings,
    playerSkins,
    unclaimedValue: carryoverValue,
    isComplete: holeResults.length === 18,
    createdAt: new Date()
  };
  
  return game;
};

export const getSkinsGameSummary = (game: SkinsGame) => {
  const totalSkins = Object.values(game.playerSkins).reduce((sum, skins) => sum + skins, 0);
  const totalEarnings = Object.values(game.playerEarnings).reduce((sum, earnings) => sum + earnings, 0);
  const unclaimedSkins = 18 - totalSkins;
  
  const playerResults = game.players.map(player => ({
    playerId: player.id,
    playerName: player.name,
    skinsWon: game.playerSkins[player.id] || 0,
    earnings: game.playerEarnings[player.id] || 0
  })).sort((a, b) => b.earnings - a.earnings);
  
  return {
    totalSkins,
    totalEarnings,
    unclaimedSkins,
    unclaimedValue: game.unclaimedValue,
    playerResults
  };
};