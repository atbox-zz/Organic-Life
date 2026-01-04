/**
 * 細胞進化系統
 * 玩家可以根據進度解鎖不同類型的細胞
 */

export interface CellType {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  unlockLevel: number;
  unlockScore: number;
  icon: string;
  color: string;
  glowColor: string;
  baseElements: {
    C: number;
    H: number;
    O: number;
    N: number;
    P: number;
    S: number;
  };
  specialAbility: string;
  scientificInfo: string;
  characteristics: string[];
}

/**
 * 原核細胞 - 細菌
 * 最簡單的細胞，無細胞核
 */
export const PROKARYOTIC_CELL: CellType = {
  id: 'prokaryotic',
  name: 'Prokaryotic Cell',
  chineseName: '原核細胞',
  description: '最簡單的細胞形式，無細胞核，包括細菌和古菌',
  unlockLevel: 1,
  unlockScore: 0,
  icon: '🦠',
  color: '#06b6d4',
  glowColor: 'rgba(6, 182, 212, 0.5)',
  baseElements: {
    C: 5,
    H: 8,
    O: 4,
    N: 2,
    P: 1,
    S: 0,
  },
  specialAbility: '快速繁殖 - 每次合成時獲得額外 10% 分數',
  scientificInfo:
    '原核細胞是地球上最古老的生命形式，已存在約 35 億年。它們沒有細胞核和其他細胞器，但具有高度的適應性和繁殖能力。細菌是原核細胞的典型代表。',
  characteristics: ['無細胞核', '無細胞器', '快速繁殖', '適應性強'],
};

/**
 * 植物細胞
 * 真核細胞，含有細胞壁和葉綠體
 */
export const PLANT_CELL: CellType = {
  id: 'plant',
  name: 'Plant Cell',
  chineseName: '植物細胞',
  description: '含有細胞壁和葉綠體的真核細胞，進行光合作用',
  unlockLevel: 3,
  unlockScore: 200,
  icon: '🌱',
  color: '#84cc16',
  glowColor: 'rgba(132, 204, 22, 0.5)',
  baseElements: {
    C: 8,
    H: 12,
    O: 6,
    N: 3,
    P: 2,
    S: 1,
  },
  specialAbility: '光合作用 - 每次合成時恢復 15% 能量',
  scientificInfo:
    '植物細胞是真核細胞，具有細胞壁、大液泡和葉綠體等特有結構。葉綠體進行光合作用，將光能轉化為化學能。植物細胞通常呈矩形，具有較強的結構支持。',
  characteristics: ['有細胞壁', '有葉綠體', '進行光合作用', '結構穩定'],
};

/**
 * 動物細胞
 * 真核細胞，無細胞壁，具有中心體
 */
export const ANIMAL_CELL: CellType = {
  id: 'animal',
  name: 'Animal Cell',
  chineseName: '動物細胞',
  description: '無細胞壁的真核細胞，具有中心體和靈活的形態',
  unlockLevel: 2,
  unlockScore: 100,
  icon: '🧬',
  color: '#a855f7',
  glowColor: 'rgba(168, 85, 247, 0.5)',
  baseElements: {
    C: 7,
    H: 11,
    O: 5,
    N: 3,
    P: 1,
    S: 1,
  },
  specialAbility: '神經傳導 - 每次合成時增加 20% 分數',
  scientificInfo:
    '動物細胞是真核細胞，具有細胞膜、細胞核和各種細胞器。與植物細胞不同，動物細胞無細胞壁，具有中心體。動物細胞形態靈活，能進行各種複雜的生理活動。',
  characteristics: ['無細胞壁', '有中心體', '形態靈活', '代謝活躍'],
};

/**
 * 真菌細胞
 * 真核細胞，具有細胞壁但無葉綠體
 */
export const FUNGAL_CELL: CellType = {
  id: 'fungal',
  name: 'Fungal Cell',
  chineseName: '真菌細胞',
  description: '具有細胞壁但無葉綠體的真核細胞，進行異養代謝',
  unlockLevel: 4,
  unlockScore: 350,
  icon: '🍄',
  color: '#f59e0b',
  glowColor: 'rgba(245, 158, 11, 0.5)',
  baseElements: {
    C: 9,
    H: 13,
    O: 7,
    N: 3,
    P: 2,
    S: 1,
  },
  specialAbility: '分解代謝 - 每次合成時恢復 10% 健康度',
  scientificInfo:
    '真菌細胞是真核細胞，具有細胞壁但無葉綠體。真菌進行異養代謝，通過分泌酶分解有機物來獲取能量。真菌細胞壁由幾丁質組成，不同於植物細胞的纖維素。',
  characteristics: ['有細胞壁', '無葉綠體', '異養代謝', '分解能力強'],
};

/**
 * 病毒（準生物）
 * 最簡單的遺傳物質載體
 */
export const VIRAL_CELL: CellType = {
  id: 'viral',
  name: 'Viral Particle',
  chineseName: '病毒',
  description: '最簡單的遺傳物質載體，需要寄主細胞才能複製',
  unlockLevel: 5,
  unlockScore: 500,
  icon: '🦠',
  color: '#ef4444',
  glowColor: 'rgba(239, 68, 68, 0.5)',
  baseElements: {
    C: 4,
    H: 6,
    O: 3,
    N: 2,
    P: 1,
    S: 0,
  },
  specialAbility: '寄生複製 - 每次合成時額外消耗 5 分數但獲得 50% 額外獎勵',
  scientificInfo:
    '病毒是介於生命和非生命之間的物質，由遺傳物質（DNA 或 RNA）和蛋白質外殼組成。病毒無法獨立進行代謝，必須侵入寄主細胞才能複製。病毒是最簡單的遺傳物質載體。',
  characteristics: ['無細胞膜', '需要寄主', '快速複製', '高度特異性'],
};

/**
 * 所有可用的細胞類型
 */
export const ALL_CELL_TYPES: CellType[] = [
  PROKARYOTIC_CELL,
  ANIMAL_CELL,
  PLANT_CELL,
  FUNGAL_CELL,
  VIRAL_CELL,
];

/**
 * 按等級分類的細胞
 */
export const CELLS_BY_LEVEL = {
  1: [PROKARYOTIC_CELL],
  2: [ANIMAL_CELL],
  3: [PLANT_CELL],
  4: [FUNGAL_CELL],
  5: [VIRAL_CELL],
};

/**
 * 按分數分類的細胞
 */
export const CELLS_BY_SCORE = {
  0: PROKARYOTIC_CELL,
  100: ANIMAL_CELL,
  200: PLANT_CELL,
  350: FUNGAL_CELL,
  500: VIRAL_CELL,
};

/**
 * 獲取當前可用的細胞
 */
export function getAvailableCells(level: number, score: number): CellType[] {
  return ALL_CELL_TYPES.filter(
    cell => cell.unlockLevel <= level && cell.unlockScore <= score
  );
}

/**
 * 獲取下一個可解鎖的細胞
 */
export function getNextCell(level: number, score: number): CellType | null {
  const locked = ALL_CELL_TYPES.find(
    cell => cell.unlockLevel > level || cell.unlockScore > score
  );
  return locked || null;
}

/**
 * 計算細胞進化進度
 */
export function getCellEvolutionProgress(level: number, score: number): {
  current: CellType;
  next: CellType | null;
  progressPercent: number;
} {
  const available = getAvailableCells(level, score);
  const current = available[available.length - 1] || PROKARYOTIC_CELL;
  const next = getNextCell(level, score);

  let progressPercent = 100;
  if (next) {
    const scoreNeeded = next.unlockScore - score;
    const scoreTotal = next.unlockScore - current.unlockScore;
    progressPercent = Math.max(0, Math.min(100, ((scoreTotal - scoreNeeded) / scoreTotal) * 100));
  }

  return { current, next, progressPercent };
}
