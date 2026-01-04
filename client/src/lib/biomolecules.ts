/**
 * 生物大分子定義和配方
 * 包含蛋白質、DNA、脂肪、澱粉等多種生物大分子
 */

export interface BiomoleculeRecipe {
  id: string;
  name: string;
  chineseName: string;
  type: 'protein' | 'dna' | 'lipid' | 'carbohydrate';
  description: string;
  formula: string;
  elements: {
    C: number;
    H: number;
    O: number;
    N: number;
    P: number;
    S: number;
  };
  color: string;
  glowColor: string;
  difficulty: 'easy' | 'medium' | 'hard';
  scoreReward: number;
  healthReward: number;
  energyCost: number;
  scientificInfo: string;
  icon: string;
}

/**
 * 蛋白質 - 由氨基酸組成的生物大分子
 * 功能：催化反應、結構支持、信號傳遞
 */
export const PROTEIN: BiomoleculeRecipe = {
  id: 'protein',
  name: 'Protein',
  chineseName: '蛋白質',
  type: 'protein',
  description: '由多個氨基酸通過肽鍵連接而成的生物大分子',
  formula: '(C₅H₉NO₂)ₙ',
  elements: {
    C: 5,
    H: 9,
    O: 2,
    N: 1,
    P: 0,
    S: 0,
  },
  color: '#a855f7',
  glowColor: 'rgba(168, 85, 247, 0.5)',
  difficulty: 'easy',
  scoreReward: 50,
  healthReward: 15,
  energyCost: 10,
  scientificInfo:
    '蛋白質是生命的主要承擔者，參與細胞的幾乎所有生命活動。酶、激素、抗體等都是蛋白質。蛋白質由20種氨基酸組成，通過核糖體翻譯合成。',
  icon: '🧬',
};

/**
 * DNA - 遺傳物質
 * 功能：儲存遺傳信息、自我複製
 */
export const DNA: BiomoleculeRecipe = {
  id: 'dna',
  name: 'DNA',
  chineseName: '脫氧核糖核酸',
  type: 'dna',
  description: '雙螺旋結構的遺傳物質，儲存生物的遺傳信息',
  formula: '(C₁₀H₁₂N₄O₆P)ₙ',
  elements: {
    C: 10,
    H: 12,
    O: 6,
    N: 4,
    P: 1,
    S: 0,
  },
  color: '#06b6d4',
  glowColor: 'rgba(6, 182, 212, 0.5)',
  difficulty: 'hard',
  scoreReward: 100,
  healthReward: 20,
  energyCost: 20,
  scientificInfo:
    'DNA 是所有生物的遺傳物質，由四種核苷酸（A、T、G、C）組成。它通過雙螺旋結構儲存遺傳信息，並通過複製和轉錄傳遞信息。人類 DNA 包含約 30 億個鹼基對。',
  icon: '🧬',
};

/**
 * 脂肪 - 能量儲存和膜結構
 * 功能：能量儲存、細胞膜成分、信號傳遞
 */
export const LIPID: BiomoleculeRecipe = {
  id: 'lipid',
  name: 'Lipid',
  chineseName: '脂肪',
  type: 'lipid',
  description: '由甘油和脂肪酸組成，主要用於能量儲存和細胞膜結構',
  formula: 'C₅₅H₁₀₄O₆',
  elements: {
    C: 55,
    H: 104,
    O: 6,
    N: 0,
    P: 0,
    S: 0,
  },
  color: '#f59e0b',
  glowColor: 'rgba(245, 158, 11, 0.5)',
  difficulty: 'medium',
  scoreReward: 75,
  healthReward: 10,
  energyCost: 15,
  scientificInfo:
    '脂肪是生物體內重要的能量物質，每克脂肪氧化產生的能量是糖類的兩倍。脂肪還是細胞膜的主要成分，並參與激素合成和信號傳遞。',
  icon: '🫧',
};

/**
 * 澱粉 - 能量儲存多糖
 * 功能：能量儲存、結構支持
 */
export const STARCH: BiomoleculeRecipe = {
  id: 'starch',
  name: 'Starch',
  chineseName: '澱粉',
  type: 'carbohydrate',
  description: '由多個葡萄糖分子聚合而成的多糖，是植物的主要能量儲存物質',
  formula: '(C₆H₁₀O₅)ₙ',
  elements: {
    C: 6,
    H: 10,
    O: 5,
    N: 0,
    P: 0,
    S: 0,
  },
  color: '#84cc16',
  glowColor: 'rgba(132, 204, 22, 0.5)',
  difficulty: 'easy',
  scoreReward: 40,
  healthReward: 12,
  energyCost: 8,
  scientificInfo:
    '澱粉是植物儲存能量的主要形式，由直鏈澱粉和支鏈澱粉組成。人類消化澱粉產生葡萄糖，提供日常能量。澱粉也用於工業和食品加工。',
  icon: '🌾',
};

/**
 * 葡萄糖 - 基礎能量分子（已有）
 * 功能：直接能量供應、其他分子的前體
 */
export const GLUCOSE: BiomoleculeRecipe = {
  id: 'glucose',
  name: 'Glucose',
  chineseName: '葡萄糖',
  type: 'carbohydrate',
  description: '簡單糖，是細胞進行呼吸作用的主要能量來源',
  formula: 'C₆H₁₂O₆',
  elements: {
    C: 6,
    H: 12,
    O: 6,
    N: 0,
    P: 0,
    S: 0,
  },
  color: '#06b6d4',
  glowColor: 'rgba(6, 182, 212, 0.5)',
  difficulty: 'easy',
  scoreReward: 10,
  healthReward: 5,
  energyCost: 5,
  scientificInfo:
    '葡萄糖是最重要的單糖，通過光合作用產生，通過細胞呼吸氧化產生 ATP。它是所有生物的主要能量來源，也是其他有機物的合成前體。',
  icon: '🧬',
};

/**
 * RNA - 信息傳遞分子
 * 功能：轉錄遺傳信息、蛋白質合成、催化反應
 */
export const RNA: BiomoleculeRecipe = {
  id: 'rna',
  name: 'RNA',
  chineseName: '核糖核酸',
  type: 'dna',
  description: '單鏈核酸分子，參與遺傳信息的轉錄和蛋白質合成',
  formula: '(C₁₀H₁₂N₄O₇P)ₙ',
  elements: {
    C: 10,
    H: 12,
    O: 7,
    N: 4,
    P: 1,
    S: 0,
  },
  color: '#ef4444',
  glowColor: 'rgba(239, 68, 68, 0.5)',
  difficulty: 'medium',
  scoreReward: 60,
  healthReward: 12,
  energyCost: 12,
  scientificInfo:
    'RNA 是單鏈核酸，分為 mRNA、tRNA 和 rRNA 三種類型。mRNA 攜帶遺傳信息，tRNA 轉運氨基酸，rRNA 是核糖體的成分。RNA 也具有催化活性。',
  icon: '🧬',
};

/**
 * 所有可用的生物大分子
 */
export const ALL_BIOMOLECULES: BiomoleculeRecipe[] = [
  GLUCOSE,
  PROTEIN,
  DNA,
  RNA,
  LIPID,
  STARCH,
];

/**
 * 按難度分類的生物大分子
 */
export const BIOMOLECULES_BY_DIFFICULTY = {
  easy: [GLUCOSE, PROTEIN, STARCH],
  medium: [RNA, LIPID],
  hard: [DNA],
};

/**
 * 按類型分類的生物大分子
 */
export const BIOMOLECULES_BY_TYPE = {
  protein: [PROTEIN],
  dna: [DNA, RNA],
  lipid: [LIPID],
  carbohydrate: [GLUCOSE, STARCH],
};
