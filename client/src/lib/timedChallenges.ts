/**
 * 限時挑戰系統 - 隨機生成的時間限制挑戰
 */

export interface TimedChallenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'blackhole' | 'element_storm' | 'synthesis_frenzy' | 'energy_crisis' | 'mutation_surge';
  difficulty: 'extreme' | 'hard' | 'medium';
  durationSeconds: number;
  startTime: number;
  endTime: number;
  targetScore: number;
  modifier: {
    scoreMultiplier?: number;
    elementConsumption?: number;
    energyConsumption?: number;
    elementReduction?: number;
  };
  rewards: {
    score: number;
    bonus: number;
    limitedAchievement?: string;
  };
  active: boolean;
  completed: boolean;
  progress: number;
}

export interface LimitedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'legendary' | 'epic' | 'rare' | 'uncommon';
  challenge: string;
  unlocked: boolean;
  unlockedDate?: string;
}

// 限時挑戰類型配置
export const TIMED_CHALLENGE_TYPES = {
  blackhole: {
    name: '黑洞吞噬',
    description: '黑洞正在吞噬能量！在 3 分鐘內完成 500 分的合成',
    icon: '🌌',
    difficulty: 'extreme' as const,
    durationSeconds: 180,
    targetScore: 500,
    modifier: {
      scoreMultiplier: 2.5,
      energyConsumption: 1.5,
    },
    rewards: {
      score: 1000,
      bonus: 500,
      limitedAchievement: 'blackhole_survivor',
    },
  },
  element_storm: {
    name: '元素風暴',
    description: '元素風暴來臨！所有元素供應減少 70%，但分數獎勵翻倍',
    icon: '⛈️',
    difficulty: 'extreme' as const,
    durationSeconds: 120,
    targetScore: 300,
    modifier: {
      scoreMultiplier: 2.0,
      elementReduction: 0.3,
    },
    rewards: {
      score: 800,
      bonus: 400,
      limitedAchievement: 'storm_chaser',
    },
  },
  synthesis_frenzy: {
    name: '合成狂潮',
    description: '進入瘋狂合成模式！5 分鐘內合成 10 個分子',
    icon: '🔥',
    difficulty: 'hard' as const,
    durationSeconds: 300,
    targetScore: 400,
    modifier: {
      scoreMultiplier: 1.8,
      elementConsumption: 0.8,
    },
    rewards: {
      score: 600,
      bonus: 300,
      limitedAchievement: 'synthesis_master',
    },
  },
  energy_crisis: {
    name: '能量危機',
    description: '能量即將耗盡！在 4 分鐘內恢復能量到 80%',
    icon: '⚡',
    difficulty: 'hard' as const,
    durationSeconds: 240,
    targetScore: 350,
    modifier: {
      scoreMultiplier: 1.5,
      energyConsumption: 2.0,
    },
    rewards: {
      score: 500,
      bonus: 250,
      limitedAchievement: 'energy_savior',
    },
  },
  mutation_surge: {
    name: '突變浪潮',
    description: '細胞發生突變！合成特殊分子以穩定基因序列',
    icon: '🧬',
    difficulty: 'medium' as const,
    durationSeconds: 150,
    targetScore: 250,
    modifier: {
      scoreMultiplier: 1.3,
      elementConsumption: 1.2,
    },
    rewards: {
      score: 400,
      bonus: 200,
      limitedAchievement: 'mutation_handler',
    },
  },
};

// 限時成就配置
export const LIMITED_ACHIEVEMENTS: LimitedAchievement[] = [
  {
    id: 'blackhole_survivor',
    name: '黑洞倖存者',
    description: '在黑洞吞噬挑戰中倖存下來',
    icon: '🌌',
    rarity: 'legendary',
    challenge: 'blackhole',
    unlocked: false,
  },
  {
    id: 'storm_chaser',
    name: '風暴獵人',
    description: '在元素風暴中完成挑戰',
    icon: '⛈️',
    rarity: 'legendary',
    challenge: 'element_storm',
    unlocked: false,
  },
  {
    id: 'synthesis_master',
    name: '合成大師',
    description: '在合成狂潮中展現卓越技能',
    icon: '🔥',
    rarity: 'epic',
    challenge: 'synthesis_frenzy',
    unlocked: false,
  },
  {
    id: 'energy_savior',
    name: '能量救世主',
    description: '在能量危機中拯救細胞',
    icon: '⚡',
    rarity: 'epic',
    challenge: 'energy_crisis',
    unlocked: false,
  },
  {
    id: 'mutation_handler',
    name: '突變處理者',
    description: '成功處理細胞突變',
    icon: '🧬',
    rarity: 'rare',
    challenge: 'mutation_surge',
    unlocked: false,
  },
  {
    id: 'challenge_collector',
    name: '挑戰收集家',
    description: '完成所有類型的限時挑戰',
    icon: '🏆',
    rarity: 'epic',
    challenge: 'all',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    name: '速度惡魔',
    description: '在限時挑戰中獲得 3 倍分數倍數',
    icon: '⚙️',
    rarity: 'rare',
    challenge: 'any',
    unlocked: false,
  },
  {
    id: 'perfect_timing',
    name: '完美時機',
    description: '在限時挑戰最後 10 秒內完成目標',
    icon: '⏰',
    rarity: 'rare',
    challenge: 'any',
    unlocked: false,
  },
];

/**
 * 生成隨機限時挑戰
 */
export function generateRandomTimedChallenge(): TimedChallenge {
  const types = Object.entries(TIMED_CHALLENGE_TYPES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const [typeKey, typeConfig] = randomType;

  const now = Date.now();
  const endTime = now + typeConfig.durationSeconds * 1000;

  return {
    id: `challenge_${Date.now()}`,
    name: typeConfig.name,
    description: typeConfig.description,
    icon: typeConfig.icon,
    type: typeKey as any,
    difficulty: typeConfig.difficulty,
    durationSeconds: typeConfig.durationSeconds,
    startTime: now,
    endTime: endTime,
    targetScore: typeConfig.targetScore,
    modifier: typeConfig.modifier,
    rewards: typeConfig.rewards,
    active: true,
    completed: false,
    progress: 0,
  };
}

/**
 * 計算剩餘時間（秒）
 */
export function getRemainingTime(challenge: TimedChallenge): number {
  const remaining = Math.max(0, challenge.endTime - Date.now());
  return Math.ceil(remaining / 1000);
}

/**
 * 檢查挑戰是否已過期
 */
export function isChallengeExpired(challenge: TimedChallenge): boolean {
  return Date.now() > challenge.endTime;
}

/**
 * 計算挑戰進度百分比
 */
export function getChallengeProgress(challenge: TimedChallenge): number {
  const totalTime = challenge.durationSeconds * 1000;
  const elapsedTime = Date.now() - challenge.startTime;
  return Math.min((elapsedTime / totalTime) * 100, 100);
}

/**
 * 獲取挑戰難度顏色
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'extreme':
      return 'text-red-500';
    case 'hard':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    default:
      return 'text-green-500';
  }
}

/**
 * 獲取成就稀有度顏色
 */
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'from-yellow-600 to-orange-600';
    case 'epic':
      return 'from-purple-600 to-pink-600';
    case 'rare':
      return 'from-blue-600 to-cyan-600';
    case 'uncommon':
      return 'from-green-600 to-teal-600';
    default:
      return 'from-gray-600 to-gray-700';
  }
}

/**
 * 獲取成就稀有度標籤
 */
export function getRarityLabel(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return '傳奇';
    case 'epic':
      return '史詩';
    case 'rare':
      return '稀有';
    case 'uncommon':
      return '罕見';
    default:
      return '普通';
  }
}
