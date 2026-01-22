import { useContext } from 'react';
import { GameContext } from '../context/game';
import type { GameContextType } from '../types';

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context as GameContextType;
}
