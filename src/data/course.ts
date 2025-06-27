export const courseData = [
  { hole: 1, par: 4 },
  { hole: 2, par: 5 },
  { hole: 3, par: 3 },
  { hole: 4, par: 5 },
  { hole: 5, par: 5 },
  { hole: 6, par: 5 },
  { hole: 7, par: 3 },
  { hole: 8, par: 4 },
  { hole: 9, par: 3 },
  { hole: 10, par: 4 },
  { hole: 11, par: 4 },
  { hole: 12, par: 5 },
  { hole: 13, par: 4 },
  { hole: 14, par: 3 },
  { hole: 15, par: 5 },
  { hole: 16, par: 4 },
  { hole: 17, par: 4 },
  { hole: 18, par: 4 }
];

export const segments = [
  { holes: [1, 2, 3], name: 'Holes 1-3', scoringType: 'best1' as const },
  { holes: [4, 5, 6], name: 'Holes 4-6', scoringType: 'best2' as const },
  { holes: [7, 8, 9], name: 'Holes 7-9', scoringType: 'best1' as const },
  { holes: [10, 11, 12], name: 'Holes 10-12', scoringType: 'best2' as const },
  { holes: [13, 14, 15], name: 'Holes 13-15', scoringType: 'best1' as const },
  { holes: [16, 17, 18], name: 'Holes 16-18', scoringType: 'best2' as const }
];

export const payoutSegments = [
  { holes: [1, 2, 3, 4, 5, 6], name: 'Holes 1-6', payout: 100 },
  { holes: [7, 8, 9, 10, 11, 12], name: 'Holes 7-12', payout: 100 },
  { holes: [13, 14, 15, 16, 17, 18], name: 'Holes 13-18', payout: 100 }
];

// Day-specific course data with handicaps
export const courseDataByDay = {
  1: [ // Southern Pines
    { hole: 1, par: 4, handicap: 11 },
    { hole: 2, par: 5, handicap: 7 },
    { hole: 3, par: 3, handicap: 13 },
    { hole: 4, par: 5, handicap: 3 },
    { hole: 5, par: 5, handicap: 5 },
    { hole: 6, par: 5, handicap: 1 },
    { hole: 7, par: 3, handicap: 17 },
    { hole: 8, par: 4, handicap: 9 },
    { hole: 9, par: 3, handicap: 15 },
    { hole: 10, par: 4, handicap: 10 },
    { hole: 11, par: 4, handicap: 14 },
    { hole: 12, par: 5, handicap: 2 },
    { hole: 13, par: 4, handicap: 8 },
    { hole: 14, par: 3, handicap: 18 },
    { hole: 15, par: 5, handicap: 6 },
    { hole: 16, par: 4, handicap: 16 },
    { hole: 17, par: 4, handicap: 4 },
    { hole: 18, par: 4, handicap: 12 }
  ],
  2: [ // Tot Hill Farm
    { hole: 1, par: 4, handicap: 8 },
    { hole: 2, par: 4, handicap: 2 },
    { hole: 3, par: 3, handicap: 18 },
    { hole: 4, par: 5, handicap: 10 },
    { hole: 5, par: 5, handicap: 6 },
    { hole: 6, par: 3, handicap: 14 },
    { hole: 7, par: 4, handicap: 16 },
    { hole: 8, par: 5, handicap: 12 },
    { hole: 9, par: 4, handicap: 4 },
    { hole: 10, par: 4, handicap: 15 },
    { hole: 11, par: 3, handicap: 13 },
    { hole: 12, par: 4, handicap: 5 },
    { hole: 13, par: 3, handicap: 9 },
    { hole: 14, par: 4, handicap: 7 },
    { hole: 15, par: 3, handicap: 17 },
    { hole: 16, par: 5, handicap: 3 },
    { hole: 17, par: 4, handicap: 1 },
    { hole: 18, par: 5, handicap: 11 }
  ],
  3: [ // Tobacco Road
    { hole: 1, par: 5, handicap: 3 },
    { hole: 2, par: 4, handicap: 11 },
    { hole: 3, par: 3, handicap: 17 },
    { hole: 4, par: 5, handicap: 9 },
    { hole: 5, par: 4, handicap: 15 },
    { hole: 6, par: 3, handicap: 13 },
    { hole: 7, par: 4, handicap: 7 },
    { hole: 8, par: 3, handicap: 5 },
    { hole: 9, par: 4, handicap: 1 },
    { hole: 10, par: 4, handicap: 6 },
    { hole: 11, par: 5, handicap: 10 },
    { hole: 12, par: 4, handicap: 14 },
    { hole: 13, par: 5, handicap: 2 },
    { hole: 14, par: 3, handicap: 8 },
    { hole: 15, par: 4, handicap: 12 },
    { hole: 16, par: 4, handicap: 16 },
    { hole: 17, par: 3, handicap: 18 },
    { hole: 18, par: 4, handicap: 4 }
  ]
};