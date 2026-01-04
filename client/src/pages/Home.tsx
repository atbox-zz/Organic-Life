import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { FloatingText } from '@/components/AnimationEffects';
import { MoleculeSelector, MoleculeDetail } from '@/components/MoleculeSelector';
import { BiomoleculeRecipe, ALL_BIOMOLECULES } from '@/lib/biomolecules';
import { GameProvider } from '@/contexts/GameContext';
import { CellEvolutionPanel } from '@/components/CellEvolutionPanel';
import { ALL_CELL_TYPES, getAvailableCells } from '@/lib/cellEvolution';
import type { CellType } from '@/lib/cellEvolution';
import { LeaderboardAndAchievements } from '@/components/LeaderboardAndAchievements';
import type { GameStats } from '@/lib/achievements';
import { CloudLeaderboard } from '@/components/CloudLeaderboard';
import { PlayerHeader } from '@/components/PlayerHeader';
import { DailyChallengesPanel } from '@/components/DailyChallengesPanel';
import { SignInRewardsPanel } from '@/components/SignInRewardsPanel';
import { SeasonalEventsPanel } from '@/components/SeasonalEventsPanel';
import { TimedChallengePanel } from '@/components/TimedChallengePanel';
import { LimitedAchievementsPanel } from '@/components/LimitedAchievementsPanel';

interface Element {
  symbol: string;
  name: string;
  count: number;
  color: string;
}

function GameContent() {
  // 添加玩家頭部導航
  const { gameState, updateEnergy, updateCellHealth, createMacromolecule, removeElement, animations, switchCell } = useGame();
  const { playSound } = useAudioFeedback();
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState<BiomoleculeRecipe | undefined>(
    ALL_BIOMOLECULES[0]
  );
  const synthesisButtonRef = useRef<HTMLButtonElement>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; score: number; level: number; date: string }>>([]);

  // 管理排行榜
  useEffect(() => {
    const saved = localStorage.getItem('organic-life-leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // 當遊戲結束時保存到排行榜
  const saveToLeaderboard = () => {
    const newEntry = {
      rank: leaderboard.length + 1,
      score: gameState.score,
      level: gameState.level,
      date: new Date().toLocaleDateString('zh-TW'),
    };
    const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem('organic-life-leaderboard', JSON.stringify(updated));
  };

  // 構建遊戲統計數據
  const gameStats: GameStats = {
    score: gameState.score,
    level: gameState.level,
    totalMonomers: gameState.totalMonomersCreated,
    totalMacromolecules: gameState.totalMacromoleculesCreated,
    cellsUnlocked: gameState.cellsUnlocked.length,
    maxEnergy: 100,
    maxHealth: 100,
    moleculesCreated: gameState.moleculesCreated,
    cellsEvolved: gameState.cellsUnlocked,
  };

  const elementList: Element[] = [
    { symbol: 'C', name: '碳', count: gameState.elements.C, color: '#06b6d4' },
    { symbol: 'H', name: '氫', count: gameState.elements.H, color: '#0d9488' },
    { symbol: 'O', name: '氧', count: gameState.elements.O, color: '#a855f7' },
    { symbol: 'N', name: '氮', count: gameState.elements.N, color: '#84cc16' },
    { symbol: 'P', name: '磷', count: gameState.elements.P, color: '#f59e0b' },
    { symbol: 'S', name: '硫', count: gameState.elements.S, color: '#ef4444' },
  ];

  const handleSynthesizeMolecule = () => {
    if (!selectedMolecule) return;

    // 檢查是否有足夠的元素
    const canSynthesize = Object.entries(selectedMolecule.elements).every(
      ([element, required]) =>
        gameState.elements[element as keyof typeof selectedMolecule.elements] >= required
    );

    if (!canSynthesize) {
      playSound('error');
      return;
    }

    setIsAnimating(true);
    playSound('synthesis');

    // 消耗元素
    Object.entries(selectedMolecule.elements).forEach(([element, required]) => {
      if (required > 0) {
        removeElement(element as any, required);
      }
    });

    // 獲取按鈕位置以觸發動畫
    const rect = synthesisButtonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : 0;
    const y = rect ? rect.top : 0;

    // 創建大分子
    createMacromolecule(
      {
        id: `macro-${Date.now()}`,
        name: selectedMolecule.name,
        chineseName: selectedMolecule.chineseName,
        type: selectedMolecule.type,
        monomers: [],
        color: selectedMolecule.color,
        description: selectedMolecule.description,
        formula: selectedMolecule.formula,
        scientificInfo: selectedMolecule.scientificInfo,
        icon: selectedMolecule.icon,
      },
      x,
      y
    );

    // 更新能量和健康度
    updateEnergy(-selectedMolecule.energyCost, x, y);
    updateCellHealth(selectedMolecule.healthReward, x, y);

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCollectElement = (symbol: string) => {
    playSound('collect');
  };

  return (
    <div className="min-h-screen bg-background">
      <PlayerHeader />
      <div className="relative hex-grid">
      {/* 動畫層 */}
      <div className="fixed inset-0 pointer-events-none">
        {animations.map((anim) => {
          if (anim.type === 'floating-text') {
            return (
              <FloatingText
                key={anim.id}
                text={anim.text || ''}
                x={anim.x}
                y={anim.y}
                color={anim.color}
                duration={anim.duration}
              />
            );
          }
          return null;
        })}
      </div>

      {/* 頭部導航 */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center transform transition-transform hover:scale-110">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins' }}>Ω</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Poppins' }}>有機生命</h1>
              <p className="text-xs text-muted-foreground">Organic Life - 科學模擬遊戲</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">分數</div>
            <div className="text-2xl font-mono font-bold text-cyan-400 transition-all duration-300">
              {gameState.score}
            </div>
          </div>
        </div>
      </header>

      {/* 主遊戲區域 */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側面板 - 元素庫存 */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4 mb-4">
              <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
                元素庫存
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {elementList.map((elem) => (
                  <div
                    key={elem.symbol}
                    className="p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-all cursor-pointer group transform hover:scale-105"
                    onClick={() => handleCollectElement(elem.symbol)}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 mx-auto mb-2 transition-all group-hover:animate-pulse"
                      style={{
                        borderColor: elem.color,
                        color: elem.color,
                        boxShadow: `0 0 10px ${elem.color}40`,
                      }}
                    >
                      {elem.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground text-center mb-1">
                      {elem.name}
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-mono font-bold text-foreground">
                        {elem.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 分子選擇器 */}
            <MoleculeSelector
              onSelect={setSelectedMolecule}
              selectedMolecule={selectedMolecule}
              availableElements={gameState.elements}
            />

            {/* 細胞進化面板 */}
            <CellEvolutionPanel
              level={gameState.level}
              score={gameState.score}
              currentCell={ALL_CELL_TYPES.find(c => c.id === gameState.currentCellId) || ALL_CELL_TYPES[0]}
              onCellChange={(cell: CellType) => switchCell(cell.id)}
            />
          </div>

          {/* 中央區域 - 主要遊戲內容 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* 分子詳情展示區 */}
              {selectedMolecule && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">{selectedMolecule.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Poppins' }}>
                        {selectedMolecule.chineseName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedMolecule.formula}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedMolecule.description}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {selectedMolecule.scientificInfo}
                  </p>

                  {/* 合成按鈕 */}
                  <Button
                    ref={synthesisButtonRef}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white transform transition-all hover:scale-105 active:scale-95"
                    onClick={handleSynthesizeMolecule}
                    disabled={isAnimating}
                    style={{ fontFamily: 'Poppins' }}
                  >
                    合成 {selectedMolecule.chineseName}
                  </Button>
                </Card>
              )}

              {/* 遊戲進度 */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
                  細胞狀態
                </h3>
                <div className="space-y-4">
                  {/* 能量指示器 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">能量</span>
                      <span className="text-sm font-mono text-lime-400">{gameState.energy}%</span>
                    </div>
                    <div className="w-full h-2 bg-card rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-lime-500 to-lime-400 transition-all duration-300"
                        style={{ width: `${gameState.energy}%` }}
                      />
                    </div>
                  </div>

                  {/* 細胞健康度 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">細胞健康度</span>
                      <span className="text-sm font-mono text-cyan-400">{gameState.cellHealth}%</span>
                    </div>
                    <div className="w-full h-2 bg-card rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${gameState.cellHealth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 右側面板 - 統計信息 */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* 元素統計 */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
                <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
                  元素統計
                </h3>
                <div className="space-y-2 text-sm">
                  {elementList.map((elem) => (
                    <div key={elem.symbol} className="flex justify-between">
                      <span className="text-muted-foreground">{elem.name}</span>
                      <span className="font-mono font-bold text-foreground">
                        {elem.count}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 遊戲進度 */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
                <h4 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Poppins' }}>
                  遊戲進度
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">等級</span>
                    <span className="font-mono font-bold text-cyan-400">Lv. {gameState.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">已合成單體</span>
                    <span className="font-mono font-bold text-lime-400">{gameState.monomers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">已組裝大分子</span>
                    <span className="font-mono font-bold text-purple-400">{gameState.macromolecules.length}</span>
                  </div>
                </div>
                       </Card>

              {/* 限時挑戰 */}
              <TimedChallengePanel playerScore={gameState.score} />

              {/* 限時成就 */}
              <LimitedAchievementsPanel />

              {/* 每日挑戰 */}
              <DailyChallengesPanel playerScore={gameState.score} />

              {/* 簽到獎勵 */}
              <SignInRewardsPanel />

              {/* 季節性活動 */}
              <SeasonalEventsPanel playerScore={gameState.score} />

              {/* 排行榜和成就 */}
              <LeaderboardAndAchievements stats={gameStats} leaderboard={leaderboard} />

              {/* 雲端排行榜 */}
              <CloudLeaderboard />

              {/* 教育信息卡 */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
                <h4 className="text-sm font-bold text-foreground mb-2" style={{ fontFamily: 'Poppins' }}>
                  科學知識
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CHONPS 六大元素構成地球生命物質的 98%。碳是生命的骨架，氫和氧形成水，氮參與蛋白質合成，粦和粦完善生命結構。
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
