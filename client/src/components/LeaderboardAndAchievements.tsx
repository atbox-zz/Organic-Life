import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Star, Lock } from 'lucide-react';
import { getUnlockedAchievements, getTotalAchievementPoints, getNextAchievements, getAchievementProgress, ALL_ACHIEVEMENTS } from '@/lib/achievements';
import type { GameStats } from '@/lib/achievements';

interface LeaderboardEntry {
  rank: number;
  score: number;
  level: number;
  date: string;
}

interface LeaderboardAndAchievementsProps {
  stats: GameStats;
  leaderboard: LeaderboardEntry[];
}

export function LeaderboardAndAchievements({
  stats,
  leaderboard,
}: LeaderboardAndAchievementsProps) {
  const unlockedAchievements = getUnlockedAchievements(stats);
  const totalPoints = getTotalAchievementPoints(stats);
  const nextAchievements = getNextAchievements(stats, 3);

  const rarityColors = {
    common: '#06b6d4',
    rare: '#8b5cf6',
    epic: '#f59e0b',
    legendary: '#ef4444',
  };

  const rarityLabels = {
    common: '普通',
    rare: '稀有',
    epic: '史詩',
    legendary: '傳奇',
  };

  return (
    <Tabs defaultValue="leaderboard" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-border/50">
        <TabsTrigger value="leaderboard" className="gap-2">
          <Trophy className="w-4 h-4" />
          排行榜
        </TabsTrigger>
        <TabsTrigger value="achievements" className="gap-2">
          <Medal className="w-4 h-4" />
          成就
        </TabsTrigger>
      </TabsList>

      {/* 排行榜標籤 */}
      <TabsContent value="leaderboard" className="space-y-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Poppins' }}>
              🏆 排行榜
            </h3>
            <p className="text-sm text-muted-foreground">
              本地最高分記錄
            </p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-muted-foreground">暫無排行榜記錄</p>
              <p className="text-xs text-muted-foreground mt-2">開始遊戲以建立記錄</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg"
                    style={{
                      backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#cd7f32' : '#374151',
                      color: index < 3 ? '#000' : '#fff',
                    }}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">第 {entry.rank} 名</span>
                      <span className="text-xs text-muted-foreground">Lv. {entry.level}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-accent">
                      {entry.score}
                    </div>
                    <div className="text-xs text-muted-foreground">分</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 當前玩家分數 */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50">
              <div>
                <div className="text-sm text-muted-foreground mb-1">您的分數</div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.score}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">等級</div>
                <div className="text-2xl font-bold text-primary">
                  Lv. {stats.level}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      {/* 成就標籤 */}
      <TabsContent value="achievements" className="space-y-4">
        {/* 成就統計 */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="text-3xl font-bold text-accent mb-1">
                {unlockedAchievements.length}
              </div>
              <div className="text-xs text-muted-foreground">已獲得成就</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="text-3xl font-bold text-primary mb-1">
                {totalPoints}
              </div>
              <div className="text-xs text-muted-foreground">成就分數</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="text-3xl font-bold text-foreground mb-1">
                {Math.round((unlockedAchievements.length / ALL_ACHIEVEMENTS.length) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">完成度</div>
            </div>
          </div>
        </Card>

        {/* 已獲得的成就 */}
        {unlockedAchievements.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <h4 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
              ✨ 已獲得的成就
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border-2 transition-all"
                  style={{
                    borderColor: rarityColors[achievement.rarity],
                    backgroundColor: `${rarityColors[achievement.rarity]}15`,
                  }}
                >
                  <div className="text-3xl flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-foreground truncate">
                        {achievement.chineseName}
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-bold"
                        style={{
                          color: rarityColors[achievement.rarity],
                          backgroundColor: `${rarityColors[achievement.rarity]}25`,
                        }}
                      >
                        {rarityLabels[achievement.rarity]}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3" style={{ color: rarityColors[achievement.rarity] }} />
                      <span className="text-xs font-bold" style={{ color: rarityColors[achievement.rarity] }}>
                        +{achievement.points} 分
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 下一個可能的成就 */}
        {nextAchievements.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <h4 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
              🎯 即將解鎖
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {nextAchievements.map((achievement) => {
                const progress = getAchievementProgress(achievement, stats);
                return (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50 opacity-60"
                  >
                    <div className="text-3xl flex-shrink-0 opacity-50">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-foreground truncate">
                          {achievement.chineseName}
                        </div>
                        <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border/50">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        進度: {Math.round(progress)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 所有成就概覽 */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
          <h4 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
            📋 所有成就
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {ALL_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50 transition-all"
                  style={{
                    opacity: isUnlocked ? 1 : 0.4,
                  }}
                >
                  <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">
                      {achievement.chineseName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {achievement.points} 分
                    </div>
                  </div>
                  {!isUnlocked && (
                    <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
