import React, { createContext, useContext, useState, useCallback } from 'react';

export type ElementType = 'C' | 'H' | 'O' | 'N' | 'P' | 'S';

export interface Element {
  type: ElementType;
  count: number;
  color: string;
  symbol: string;
}

export interface Monomer {
  id: string;
  name: string;
  formula: string;
  elements: Record<ElementType, number>;
  color: string;
  type?: 'glucose' | 'amino-acid' | 'nucleotide' | 'fatty-acid';
}

export interface Macromolecule {
  id: string;
  name: string;
  chineseName: string;
  type: 'protein' | 'dna' | 'carbohydrate' | 'lipid' | 'rna';
  monomers: Monomer[];
  color: string;
  description: string;
  formula: string;
  scientificInfo: string;
  icon: string;
}

export interface GameState {
  level: number;
  score: number;
  elements: Record<ElementType, number>;
  monomers: Monomer[];
  macromolecules: Macromolecule[];
  cellHealth: number;
  energy: number;
  currentCellId: string;
  totalMonomersCreated: number;
  totalMacromoleculesCreated: number;
  moleculesCreated: Record<string, number>;
  cellsUnlocked: string[];
}

export interface AnimationEvent {
  id: string;
  type: 'particle' | 'pulse' | 'floating-text';
  x: number;
  y: number;
  color?: string;
  text?: string;
  duration: number;
}

interface GameContextType {
  gameState: GameState;
  addElement: (type: ElementType, count: number) => void;
  removeElement: (type: ElementType, count: number) => boolean;
  createMonomer: (monomer: Monomer, x?: number, y?: number) => void;
  createMacromolecule: (macromolecule: Macromolecule, x?: number, y?: number) => void;
  synthesizeMolecule: (moleculeId: string, x?: number, y?: number) => boolean;
  updateEnergy: (delta: number, x?: number, y?: number) => void;
  updateCellHealth: (delta: number, x?: number, y?: number) => void;
  resetGame: () => void;
  triggerAnimation: (event: AnimationEvent) => void;
  animations: AnimationEvent[];
  clearAnimation: (id: string) => void;
  switchCell: (cellId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_STATE: GameState = {
  level: 1,
  score: 0,
  elements: {
    C: 10,
    H: 15,
    O: 8,
    N: 3,
    P: 2,
    S: 1,
  },
  monomers: [],
  macromolecules: [],
  cellHealth: 100,
  energy: 100,
  currentCellId: 'prokaryotic',
  totalMonomersCreated: 0,
  totalMacromoleculesCreated: 0,
  moleculesCreated: {},
  cellsUnlocked: ['prokaryotic'],
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [animations, setAnimations] = useState<AnimationEvent[]>([]);

  const addElement = useCallback((type: ElementType, count: number) => {
    setGameState(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [type]: prev.elements[type] + count,
      },
    }));
  }, []);

  const removeElement = useCallback((type: ElementType, count: number): boolean => {
    if (gameState.elements[type] < count) {
      return false;
    }
    setGameState(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [type]: prev.elements[type] - count,
      },
    }));
    return true;
  }, [gameState.elements]);

  const createMonomer = useCallback((monomer: Monomer, x = 0, y = 0) => {
    setGameState(prev => {
      const moleculesCreated = { ...prev.moleculesCreated };
      moleculesCreated[monomer.id] = (moleculesCreated[monomer.id] || 0) + 1;
      return {
        ...prev,
        monomers: [...prev.monomers, monomer],
        score: prev.score + 10,
        totalMonomersCreated: prev.totalMonomersCreated + 1,
        moleculesCreated,
      };
    });

    // 觸發浮起文字動畫
    triggerAnimation({
      id: `monomer-${Date.now()}`,
      type: 'floating-text',
      x,
      y,
      color: '#84cc16',
      text: '+10',
      duration: 1000,
    });
  }, []);

  const createMacromolecule = useCallback((macromolecule: Macromolecule, x = 0, y = 0) => {
    setGameState(prev => {
      const moleculesCreated = { ...prev.moleculesCreated };
      moleculesCreated[macromolecule.id] = (moleculesCreated[macromolecule.id] || 0) + 1;
      return {
        ...prev,
        macromolecules: [...prev.macromolecules, macromolecule],
        score: prev.score + 50,
        level: prev.level + 1,
        totalMacromoleculesCreated: prev.totalMacromoleculesCreated + 1,
        moleculesCreated,
      };
    });
  }, []);

  const synthesizeMolecule = useCallback((moleculeId: string, x = 0, y = 0): boolean => {
    // 這個函數將由 Home 組件調用，根據分子 ID 進行合成
    // 返回是否成功合成
    return true;
  }, []);

  const updateEnergy = useCallback((delta: number, x = 0, y = 0) => {
    setGameState(prev => ({
      ...prev,
      energy: Math.max(0, Math.min(100, prev.energy + delta)),
    }));
  }, []);

  const updateCellHealth = useCallback((delta: number, x = 0, y = 0) => {
    setGameState(prev => ({
      ...prev,
      cellHealth: Math.max(0, Math.min(100, prev.cellHealth + delta)),
    }));
  }, []);

  // 在 Home 組件中單獨觸發動畫

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    setAnimations([]);
  }, []);

  const triggerAnimation = useCallback((event: AnimationEvent) => {
    setAnimations(prev => [...prev, event]);

    // 自動移除動畫
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== event.id));
    }, event.duration);
  }, []);

  const clearAnimation = useCallback((id: string) => {
    setAnimations(prev => prev.filter(a => a.id !== id));
  }, []);

  const switchCell = useCallback((cellId: string) => {
    setGameState(prev => ({
      ...prev,
      currentCellId: cellId,
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        addElement,
        removeElement,
        createMonomer,
        createMacromolecule,
        updateEnergy,
        updateCellHealth,
        resetGame,
        triggerAnimation,
        animations,
        clearAnimation,
        synthesizeMolecule,
        switchCell,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
