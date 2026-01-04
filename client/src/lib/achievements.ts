/**
 * 成就系統
 * 玩家可以通過完成特定任務來獲得成就徽章
 */

export interface Achievement {
  id: string;
  name: string;
  chineseName: string;
  description: string;
  icon: string;
  color: string;
  condition: (stats: GameStats) => boolean;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameStats {
  score: number;
  level: number;
  totalMonomers: number;
  totalMacromolecules: number;
  cellsUnlocked: number;
  maxEnergy: number;
  maxHealth: number;
  moleculesCreated: Record<string, number>;
  cellsEvolved: string[];
}

/**
 * 初級成就
 */
export const ACHIEVEMENT_FIRST_MONOMER: Achievement = {
  id: 'first_monomer',
  name: 'First Step',
  chineseName: '初次合成',
  description: '合成第一個單體分子',
  icon: '🌱',
  color: '#84cc16',
  condition: (stats) => stats.totalMonomers >= 1,
  points: 10,
  rarity: 'common',
};

export const ACHIEVEMENT_FIRST_MACROMOLECULE: Achievement = {
  id: 'first_macromolecule',
  name: 'Life Builder',
  chineseName: '首次組裝',
  description: '組裝第一個大分子',
  icon: '🧬',
  color: '#a855f7',
  condition: (stats) => stats.totalMacromolecules >= 1,
  points: 15,
  rarity: 'common',
};

export const ACHIEVEMENT_SCORE_100: Achievement = {
  id: 'score_100',
  name: 'Rising Star',
  chineseName: '初露頭角',
  description: '達到 100 分',
  icon: '⭐',
  color: '#f59e0b',
  condition: (stats) => stats.score >= 100,
  points: 20,
  rarity: 'common',
};

/**
 * 中級成就
 */
export const ACHIEVEMENT_SCORE_500: Achievement = {
  id: 'score_500',
  name: 'Molecular Master',
  chineseName: '分子大師',
  description: '達到 500 分',
  icon: '🔬',
  color: '#06b6d4',
  condition: (stats) => stats.score >= 500,
  points: 50,
  rarity: 'rare',
};

export const ACHIEVEMENT_LEVEL_5: Achievement = {
  id: 'level_5',
  name: 'Evolution Expert',
  chineseName: '進化專家',
  description: '達到 5 級',
  icon: '🦾',
  color: '#ec4899',
  condition: (stats) => stats.level >= 5,
  points: 40,
  rarity: 'rare',
};

export const ACHIEVEMENT_ALL_MOLECULES: Achievement = {
  id: 'all_molecules',
  name: 'Molecular Collection',
  chineseName: '分子收集家',
  description: '合成所有類型的分子',
  icon: '📚',
  color: '#8b5cf6',
  condition: (stats) => {
    const moleculeTypes = Object.keys(stats.moleculesCreated);
    return moleculeTypes.length >= 6;
  },
  points: 60,
  rarity: 'rare',
};

/**
 * 高級成就
 */
export const ACHIEVEMENT_SCORE_1000: Achievement = {
  id: 'score_1000',
  name: 'Genetic Engineer',
  chineseName: '遺傳工程師',
  description: '達到 1000 分',
  icon: '🧪',
  color: '#ef4444',
  condition: (stats) => stats.score >= 1000,
  points: 100,
  rarity: 'epic',
};

export const ACHIEVEMENT_LEVEL_10: Achievement = {
  id: 'level_10',
  name: 'Supreme Creator',
  chineseName: '至高創造者',
  description: '達到 10 級',
  icon: '👑',
  color: '#fbbf24',
  condition: (stats) => stats.level >= 10,
  points: 80,
  rarity: 'epic',
};

export const ACHIEVEMENT_UNLOCK_ALL_CELLS: Achievement = {
  id: 'unlock_all_cells',
  name: 'Cell Evolution Master',
  chineseName: '細胞進化大師',
  description: '解鎖所有細胞類型',
  icon: '🌍',
  color: '#10b981',
  condition: (stats) => stats.cellsUnlocked >= 5,
  points: 150,
  rarity: 'epic',
};

/**
 * 傳奇成就
 */
export const ACHIEVEMENT_SCORE_5000: Achievement = {
  id: 'score_5000',
  name: 'Life Architect',
  chineseName: '生命建築師',
  description: '達到 5000 分',
  icon: '🏛️',
  color: '#06b6d4',
  condition: (stats) => stats.score >= 5000,
  points: 250,
  rarity: 'legendary',
};

export const ACHIEVEMENT_MONOMER_MASTER: Achievement = {
  id: 'monomer_master',
  name: 'Monomer Maestro',
  chineseName: '單體大師',
  description: '合成 100 個單體',
  icon: '🎵',
  color: '#a855f7',
  condition: (stats) => stats.totalMonomers >= 100,
  points: 200,
  rarity: 'legendary',
};

export const ACHIEVEMENT_MACROMOLECULE_MASTER: Achievement = {
  id: 'macromolecule_master',
  name: 'Macromolecule Maestro',
  chineseName: '大分子大師',
  description: '組裝 50 個大分子',
  icon: '🎼',
  color: '#ec4899',
  condition: (stats) => stats.totalMacromolecules >= 50,
  points: 200,
  rarity: 'legendary',
};

/**
 * 所有成就
 */
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // 初級
  ACHIEVEMENT_FIRST_MONOMER,
  ACHIEVEMENT_FIRST_MACROMOLECULE,
  ACHIEVEMENT_SCORE_100,
  // 中級
  ACHIEVEMENT_SCORE_500,
  ACHIEVEMENT_LEVEL_5,
  ACHIEVEMENT_ALL_MOLECULES,
  // 高級
  ACHIEVEMENT_SCORE_1000,
  ACHIEVEMENT_LEVEL_10,
  ACHIEVEMENT_UNLOCK_ALL_CELLS,
  // 傳奇
  ACHIEVEMENT_SCORE_5000,
  ACHIEVEMENT_MONOMER_MASTER,
  ACHIEVEMENT_MACROMOLECULE_MASTER,
];

/**
 * 按稀有度分類的成就
 */
export const ACHIEVEMENTS_BY_RARITY = {
  common: ALL_ACHIEVEMENTS.filter(a => a.rarity === 'common'),
  rare: ALL_ACHIEVEMENTS.filter(a => a.rarity === 'rare'),
  epic: ALL_ACHIEVEMENTS.filter(a => a.rarity === 'epic'),
  legendary: ALL_ACHIEVEMENTS.filter(a => a.rarity === 'legendary'),
};

/**
 * 計算玩家已獲得的成就
 */
export function getUnlockedAchievements(stats: GameStats): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
}

/**
 * 計算玩家的總成就分數
 */
export function getTotalAchievementPoints(stats: GameStats): number {
  return getUnlockedAchievements(stats).reduce((sum, achievement) => sum + achievement.points, 0);
}

/**
 * 獲取下一個可能的成就
 */
export function getNextAchievements(stats: GameStats, limit: number = 3): Achievement[] {
  const unlocked = getUnlockedAchievements(stats);
  const unlockedIds = new Set(unlocked.map(a => a.id));
  return ALL_ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id)).slice(0, limit);
}

/**
 * 獲取成就進度百分比
 */
export function getAchievementProgress(achievement: Achievement, stats: GameStats): number {
  // 根據不同的成就類型計算進度
  if (achievement.id === 'score_100') return Math.min(100, (stats.score / 100) * 100);
  if (achievement.id === 'score_500') return Math.min(100, (stats.score / 500) * 100);
  if (achievement.id === 'score_1000') return Math.min(100, (stats.score / 1000) * 100);
  if (achievement.id === 'score_5000') return Math.min(100, (stats.score / 5000) * 100);
  if (achievement.id === 'level_5') return Math.min(100, (stats.level / 5) * 100);
  if (achievement.id === 'level_10') return Math.min(100, (stats.level / 10) * 100);
  if (achievement.id === 'monomer_master') return Math.min(100, (stats.totalMonomers / 100) * 100);
  if (achievement.id === 'macromolecule_master') return Math.min(100, (stats.totalMacromolecules / 50) * 100);
  if (achievement.id === 'unlock_all_cells') return Math.min(100, (stats.cellsUnlocked / 5) * 100);
  if (achievement.id === 'all_molecules') {
    const moleculeTypes = Object.keys(stats.moleculesCreated);
    return Math.min(100, (moleculeTypes.length / 6) * 100);
  }
  return achievement.condition(stats) ? 100 : 0;
}
