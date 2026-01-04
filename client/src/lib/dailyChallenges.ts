/**
 * 每日挑戰和季節性活動系統
 */

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetMolecule?: string;
  targetScore: number;
  reward: {
    score: number;
    bonus: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  startDate: string;
  endDate: string;
  type: 'element_scarcity' | 'synthesis_marathon' | 'cell_evolution_race' | 'molecule_madness';
  modifier: {
    elementMultiplier?: number;
    scoreMultiplier?: number;
    energyConsumption?: number;
  };
  rewards: {
    milestone: number;
    reward: number;
  }[];
  active: boolean;
}

export interface SignInReward {
  day: number;
  reward: number;
  icon: string;
  description: string;
  claimed: boolean;
}

export interface SeasonalLeaderboard {
  season: number;
  startDate: string;
  endDate: string;
  players: {
    rank: number;
    name: string;
    score: number;
    cellType: string;
    level: number;
  }[];
}

// 每日挑戰配置
export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'glucose_rush',
    name: '葡萄糖衝刺',
    description: '在 10 分鐘內合成 5 個葡萄糖分子',
    icon: '🍬',
    targetMolecule: 'glucose',
    targetScore: 50,
    reward: { score: 100, bonus: 50 },
    difficulty: 'easy',
    completed: false,
  },
  {
    id: 'protein_master',
    name: '蛋白質大師',
    description: '合成 3 個蛋白質分子',
    icon: '💪',
    targetMolecule: 'protein',
    targetScore: 150,
    reward: { score: 200, bonus: 100 },
    difficulty: 'medium',
    completed: false,
  },
  {
    id: 'dna_explorer',
    name: 'DNA 探險家',
    description: '成功合成 1 個 DNA 分子',
    icon: '🧬',
    targetMolecule: 'dna',
    targetScore: 100,
    reward: { score: 300, bonus: 150 },
    difficulty: 'hard',
    completed: false,
  },
  {
    id: 'element_collector',
    name: '元素收集家',
    description: '收集 100 個元素',
    icon: '⚛️',
    targetScore: 100,
    reward: { score: 150, bonus: 75 },
    difficulty: 'easy',
    completed: false,
  },
  {
    id: 'cell_evolution',
    name: '細胞進化者',
    description: '升級到 Lv. 3',
    icon: '🦠',
    targetScore: 200,
    reward: { score: 250, bonus: 125 },
    difficulty: 'medium',
    completed: false,
  },
];

// 季節性活動配置
export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'winter_scarcity',
    name: '冬季元素稀缺',
    description: '在元素供應減少 50% 的情況下完成合成挑戰',
    icon: '❄️',
    startDate: '2025-12-21',
    endDate: '2025-12-31',
    type: 'element_scarcity',
    modifier: {
      elementMultiplier: 0.5,
      scoreMultiplier: 1.5,
    },
    rewards: [
      { milestone: 100, reward: 500 },
      { milestone: 300, reward: 1000 },
      { milestone: 500, reward: 2000 },
    ],
    active: true,
  },
  {
    id: 'spring_marathon',
    name: '春季合成馬拉松',
    description: '在 24 小時內盡可能多地合成分子',
    icon: '🌸',
    startDate: '2026-03-20',
    endDate: '2026-03-27',
    type: 'synthesis_marathon',
    modifier: {
      scoreMultiplier: 2.0,
    },
    rewards: [
      { milestone: 50, reward: 300 },
      { milestone: 150, reward: 800 },
      { milestone: 300, reward: 1500 },
    ],
    active: false,
  },
  {
    id: 'summer_cell_race',
    name: '夏季細胞進化競賽',
    description: '率先解鎖新的細胞類型',
    icon: '☀️',
    startDate: '2026-06-21',
    endDate: '2026-06-28',
    type: 'cell_evolution_race',
    modifier: {
      scoreMultiplier: 1.2,
    },
    rewards: [
      { milestone: 200, reward: 600 },
      { milestone: 400, reward: 1200 },
      { milestone: 600, reward: 2000 },
    ],
    active: false,
  },
  {
    id: 'autumn_madness',
    name: '秋季分子瘋狂',
    description: '在能量消耗加倍的情況下完成合成',
    icon: '🍂',
    startDate: '2026-09-22',
    endDate: '2026-09-29',
    type: 'molecule_madness',
    modifier: {
      energyConsumption: 2.0,
      scoreMultiplier: 1.8,
    },
    rewards: [
      { milestone: 100, reward: 400 },
      { milestone: 250, reward: 900 },
      { milestone: 400, reward: 1800 },
    ],
    active: false,
  },
];

// 簽到獎勵配置（7 天循環）
export const SIGN_IN_REWARDS: SignInReward[] = [
  {
    day: 1,
    reward: 100,
    icon: '🎁',
    description: '歡迎回來！獲得 100 分',
    claimed: false,
  },
  {
    day: 2,
    reward: 150,
    icon: '🎀',
    description: '連續簽到 2 天，獲得 150 分',
    claimed: false,
  },
  {
    day: 3,
    reward: 200,
    icon: '🎊',
    description: '連續簽到 3 天，獲得 200 分',
    claimed: false,
  },
  {
    day: 4,
    reward: 250,
    icon: '🏆',
    description: '連續簽到 4 天，獲得 250 分',
    claimed: false,
  },
  {
    day: 5,
    reward: 300,
    icon: '⭐',
    description: '連續簽到 5 天，獲得 300 分',
    claimed: false,
  },
  {
    day: 6,
    reward: 400,
    icon: '💫',
    description: '連續簽到 6 天，獲得 400 分',
    claimed: false,
  },
  {
    day: 7,
    reward: 500,
    icon: '👑',
    description: '完成本週簽到，獲得 500 分和特殊徽章',
    claimed: false,
  },
];

// 季節排行榜配置
export const SEASONAL_LEADERBOARDS: SeasonalLeaderboard[] = [
  {
    season: 1,
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    players: [
      {
        rank: 1,
        name: '量子科學家',
        score: 8500,
        cellType: '動物細胞',
        level: 20,
      },
      {
        rank: 2,
        name: '分子工程師',
        score: 7800,
        cellType: '植物細胞',
        level: 19,
      },
      {
        rank: 3,
        name: '生命探索者',
        score: 7200,
        cellType: '真菌細胞',
        level: 18,
      },
      {
        rank: 4,
        name: '元素收集家',
        score: 6500,
        cellType: '原核細胞',
        level: 17,
      },
      {
        rank: 5,
        name: '合成大師',
        score: 5800,
        cellType: '病毒',
        level: 16,
      },
    ],
  },
];

/**
 * 獲取當前活躍的季節性活動
 */
export function getActiveSeasonalEvents(): SeasonalEvent[] {
  const now = new Date();
  return SEASONAL_EVENTS.filter((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return now >= startDate && now <= endDate;
  });
}

/**
 * 獲取今日的每日挑戰
 */
export function getTodaysChallenges(): DailyChallenge[] {
  // 根據日期循環選擇挑戰
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const challengeIndex = dayOfYear % DAILY_CHALLENGES.length;
  
  // 返回今日的 3 個挑戰
  const challenges: DailyChallenge[] = [];
  for (let i = 0; i < 3; i++) {
    const index = (challengeIndex + i) % DAILY_CHALLENGES.length;
    challenges.push({ ...DAILY_CHALLENGES[index], completed: false });
  }
  
  return challenges;
}

/**
 * 獲取當前季節
 */
export function getCurrentSeason(): number {
  const now = new Date();
  const month = now.getMonth();
  
  // 冬季：12-2 月 (1)
  // 春季：3-5 月 (2)
  // 夏季：6-8 月 (3)
  // 秋季：9-11 月 (4)
  
  if (month === 11 || month === 0 || month === 1) return 1;
  if (month >= 2 && month <= 4) return 2;
  if (month >= 5 && month <= 7) return 3;
  return 4;
}
