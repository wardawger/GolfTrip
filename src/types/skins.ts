export interface SkinsPlayer {
  id: string;
  name: string;
  handicap: number;
}

export interface SkinsHoleResult {
  hole: number;
  par: number;
  handicap: number;
  playerScores: {
    playerId: string;
    grossScore: number;
    netScore: number;
  }[];
  winnerId: string | null;
  skinValue: number;
  isCarryover: boolean;
}

export interface SkinsGame {
  id: string;
  name: string;
  players: SkinsPlayer[];
  totalPot: number;
  skinValuePerHole: number;
  day: number;
  holeResults: SkinsHoleResult[];
  playerEarnings: { [playerId: string]: number };
  playerSkins: { [playerId: string]: number };
  unclaimedValue: number;
  isComplete: boolean;
  createdAt: Date;
}

export interface SkinsGameSummary {
  totalSkins: number;
  totalEarnings: number;
  unclaimedSkins: number;
  unclaimedValue: number;
  playerResults: {
    playerId: string;
    playerName: string;
    skinsWon: number;
    earnings: number;
  }[];
}