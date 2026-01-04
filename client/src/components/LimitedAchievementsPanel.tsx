import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LIMITED_ACHIEVEMENTS, LimitedAchievement, getRarityColor, getRarityLabel } from '@/lib/timedChallenges';
import { Trophy, Lock } from 'lucide-react';

interface LimitedAchievementsPanelProps {
  unlockedAchievements?: string[];
}

export function LimitedAchievementsPanel({
  unlockedAchievements = [],
}: LimitedAchievementsPanelProps) {
  const [achievements, setAchievements] = useState<LimitedAchievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const updated = LIMITED_ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedAchievements.includes(achievement.id),
    }));
    setAchievements(updated);
  }, [unlockedAchievements]);

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          限時成就
        </h2>
        <div className="text-sm text-muted-foreground">
          {unlockedCount} / {totalCount} 已解鎖
        </div>
      </div>

      {/* 進度條 */}
      <div className="mb-6">
        <div className="w-full bg-background rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          完成度：{Math.round((unlockedCount / totalCount) * 100)}%
        </div>
      </div>

      {/* 篩選按鈕 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
            filter === 'all'
              ? 'bg-cyan-600 text-white'
              : 'bg-background/50 border border-border/50 text-foreground hover:border-cyan-500/50'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
            filter === 'unlocked'
              ? 'bg-green-600 text-white'
              : 'bg-background/50 border border-border/50 text-foreground hover:border-green-500/50'
          }`}
        >
          已解鎖 ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
            filter === 'locked'
              ? 'bg-gray-600 text-white'
              : 'bg-background/50 border border-border/50 text-foreground hover:border-gray-500/50'
          }`}
        >
          未解鎖 ({totalCount - unlockedCount})
        </button>
      </div>

      {/* 成就網格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              achievement.unlocked
                ? `border-${achievement.rarity === 'legendary' ? 'yellow-500' : achievement.rarity === 'epic' ? 'purple-500' : 'blue-500'}/50 bg-${achievement.rarity === 'legendary' ? 'yellow-500' : achievement.rarity === 'epic' ? 'purple-500' : 'blue-500'}/10`
                : 'border-border/50 bg-background/50 opacity-50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-xs font-bold text-foreground mb-1">
                {achievement.name}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full bg-background/50 ${
                achievement.rarity === 'legendary'
                  ? 'text-yellow-400'
                  : achievement.rarity === 'epic'
                    ? 'text-purple-400'
                    : achievement.rarity === 'rare'
                      ? 'text-blue-400'
                      : 'text-green-400'
              }`}>
                {getRarityLabel(achievement.rarity)}
              </div>
              {!achievement.unlocked && (
                <div className="mt-2 text-gray-400">
                  <Lock className="w-4 h-4 mx-auto" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {filter === 'unlocked'
            ? '還沒有解鎖任何限時成就，開始挑戰吧！'
            : filter === 'locked'
              ? '所有成就都已解鎖！'
              : '暫無成就'}
        </div>
      )}

      {/* 成就說明 */}
      <div className="mt-6 p-3 bg-purple-500/10 rounded-lg border border-purple-500/50 text-xs text-muted-foreground">
        <div className="font-bold text-purple-400 mb-2">💡 成就說明</div>
        <div className="space-y-1">
          <div>
            <span className="text-yellow-400">傳奇成就</span> - 完成最困難的限時挑戰
          </div>
          <div>
            <span className="text-purple-400">史詩成就</span> - 完成高難度的限時挑戰
          </div>
          <div>
            <span className="text-blue-400">稀有成就</span> - 完成中等難度的限時挑戰
          </div>
        </div>
      </div>
    </Card>
  );
}
