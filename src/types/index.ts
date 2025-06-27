export interface Player {
  id: string;
  name: string;
  isAsterisk: boolean;
  handicap: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface HoleScore {
  playerId: string;
  grossScore: number;
  netScore: number;
  bonusStrokesUsed?: number;
}

export interface Hole {
  number: number;
  par: number;
  scores: HoleScore[];
}

export interface Round {
  id: string;
  day: number;
  teams: Team[];
  holes: Hole[];
  skinsWinners: { [key: number]: string[] };
  skinsMode: 'gross' | 'net';
}

export interface Segment {
  holes: number[];
  name: string;
  scoringType: 'best1' | 'best2';
}

export interface SegmentResult {
  segment: Segment;
  teamScores: { [teamId: string]: number };
  winner: string[];
  payout: number;
}

export interface DayResult {
  day: number;
  segments: SegmentResult[];
  skinsTotal: number;
  skinsWinners: { [hole: number]: string[] };
}