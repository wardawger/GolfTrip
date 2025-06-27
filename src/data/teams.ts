import { Team } from '../types';
import { players } from './players';

const getPlayerById = (name: string) => players.find(p => p.name === name)!;

export const teamPairings = {
  day1: [
    {
      id: 'A1',
      name: 'Team A',
      players: [getPlayerById('Mike'), getPlayerById('Warren'), getPlayerById('Drew')]
    },
    {
      id: 'B1',
      name: 'Team B',
      players: [getPlayerById('Steve'), getPlayerById('Dan Y')]
    },
    {
      id: 'C1',
      name: 'Team C',
      players: [getPlayerById('Ryan'), getPlayerById('MJ')]
    },
    {
      id: 'D1',
      name: 'Team D',
      players: [getPlayerById('Brauch'), getPlayerById('Bryan')]
    },
    {
      id: 'E1',
      name: 'Team E',
      players: [getPlayerById('Kevin'), getPlayerById('Dan W')]
    }
  ],
  day2: [
    {
      id: 'A2',
      name: 'Team A',
      players: [getPlayerById('Steve'), getPlayerById('Kevin'), getPlayerById('Dan Y')]
    },
    {
      id: 'B2',
      name: 'Team B',
      players: [getPlayerById('Mike'), getPlayerById('Bryan')]
    },
    {
      id: 'C2',
      name: 'Team C',
      players: [getPlayerById('Warren'), getPlayerById('MJ')]
    },
    {
      id: 'D2',
      name: 'Team D',
      players: [getPlayerById('Ryan'), getPlayerById('Drew')]
    },
    {
      id: 'E2',
      name: 'Team E',
      players: [getPlayerById('Brauch'), getPlayerById('Dan W')]
    }
  ],
  day3: [
    {
      id: 'A3',
      name: 'Team A',
      players: [getPlayerById('Ryan'), getPlayerById('Brauch'), getPlayerById('MJ')]
    },
    {
      id: 'B3',
      name: 'Team B',
      players: [getPlayerById('Mike'), getPlayerById('Dan Y')]
    },
    {
      id: 'C3',
      name: 'Team C',
      players: [getPlayerById('Steve'), getPlayerById('Bryan')]
    },
    {
      id: 'D3',
      name: 'Team D',
      players: [getPlayerById('Warren'), getPlayerById('Dan W')]
    },
    {
      id: 'E3',
      name: 'Team E',
      players: [getPlayerById('Kevin'), getPlayerById('Drew')]
    }
  ]
};