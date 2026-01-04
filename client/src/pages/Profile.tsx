import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { LogOut, Trophy, Zap, Target, Award } from 'lucide-react';

interface PlayerProfile {
  name: string;
  email: string;
  joinDate: string;
  totalScore: number;
  level: number;
  totalMonomers: number;
  totalMacromolecules: number;
  cellsUnlocked: number;
  achievementsCount: number;
  favoriteCell: string;
}

const ACHIEVEMENT_BADGES = [
  { id: 'first_monomer', name: '初次合成', icon: '🧪', color: 'bg-blue-500' },
  { id: 'first_macromolecule', name: '首個大分子', icon: '🧬', color: 'bg-purple-500' },
  { id: 'protein_master', name: '蛋白質大師', icon: '💪', color: 'bg-red-500' },
  { id: 'dna_explorer', name: 'DNA 探索者', icon: '🔬', color: 'bg-cyan-500' },
  { id: 'cell_evolution', name: '細胞進化者', icon: '🦠', color: 'bg-green-500' },
  { id: 'score_100', name: '百分達成', icon: '💯', color: 'bg-yellow-500' },
  { id: 'score_500', name: '五百成就', icon: '🌟', color: 'bg-orange-500' },
  { id: 'score_1000', name: '千分傳奇', icon: '👑', color: 'bg-pink-500' },
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // 獲取當前用戶信息
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();

  // 登出
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    if (user) {
      // 構建玩家檔案（實際應用應從數據庫獲取）
      const mockProfile: PlayerProfile = {
        name: user.name || '遊戲玩家',
        email: user.email || '',
        joinDate: new Date(user.createdAt).toLocaleDateString('zh-TW'),
        totalScore: 0, // 應從遊戲狀態獲取
        level: 1,
        totalMonomers: 0,
        totalMacromolecules: 0,
        cellsUnlocked: 1,
        achievementsCount: 0,
        favoriteCell: '原核細胞',
      };

      setProfile(mockProfile);

      // 根據分數解鎖成就
      const achievements: string[] = [];
      if (mockProfile.totalScore > 0) achievements.push('first_monomer');
      if (mockProfile.totalScore > 50) achievements.push('first_macromolecule');
      if (mockProfile.totalScore > 100) achievements.push('score_100');
      if (mockProfile.totalScore > 500) achievements.push('score_500');
      if (mockProfile.totalScore > 1000) achievements.push('score_1000');
      if (mockProfile.cellsUnlocked > 2) achievements.push('cell_evolution');

      setUnlockedAchievements(achievements);
    }
  }, [user]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation('/');
      },
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">載入中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">請先登入以查看個人檔案</p>
          <Button onClick={() => setLocation('/')} className="bg-cyan-600 hover:bg-cyan-700">
            返回遊戲
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 頭部導航 */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-bold">
              {profile?.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-foreground">{profile?.name}</h1>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-xs"
            >
              返回遊戲
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs"
            >
              <LogOut className="w-4 h-4 mr-1" />
              登出
            </Button>
          </div>
        </div>
      </div>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側 - 玩家統計 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本統計 */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">遊戲統計</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
                  <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-400">{profile?.totalScore || 0}</div>
                  <div className="text-xs text-muted-foreground">總分數</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
                  <Zap className="w-6 h-6 text-lime-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-lime-400">Lv. {profile?.level}</div>
                  <div className="text-xs text-muted-foreground">等級</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
                  <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">{profile?.totalMacromolecules}</div>
                  <div className="text-xs text-muted-foreground">大分子</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
                  <Award className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-400">{profile?.cellsUnlocked}</div>
                  <div className="text-xs text-muted-foreground">細胞類型</div>
                </div>
              </div>
            </Card>

            {/* 成就徽章 */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">成就徽章</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACHIEVEMENT_BADGES.map((badge) => {
                  const isUnlocked = unlockedAchievements.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        isUnlocked
                          ? `${badge.color} border-yellow-400 shadow-lg shadow-yellow-400/50`
                          : 'bg-background/50 border-border/50 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-xs font-bold text-white">{badge.name}</div>
                      {!isUnlocked && (
                        <div className="text-xs text-gray-300 mt-1">未解鎖</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 遊戲信息 */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">遊戲信息</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">加入日期</span>
                  <span className="font-mono text-foreground">{profile?.joinDate}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">最愛細胞</span>
                  <span className="font-mono text-cyan-400">{profile?.favoriteCell}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">已合成單體</span>
                  <span className="font-mono text-lime-400">{profile?.totalMonomers}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">成就總數</span>
                  <span className="font-mono text-purple-400">{unlockedAchievements.length} / {ACHIEVEMENT_BADGES.length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* 右側 - 玩家卡片 */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-gradient-to-br from-cyan-900/50 to-teal-900/50 backdrop-blur-sm p-6 sticky top-24">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {profile?.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{profile?.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{profile?.email}</p>

                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">排行榜排名</div>
                    <div className="text-2xl font-bold text-yellow-400">#未上榜</div>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">完成度</div>
                    <div className="w-full bg-background rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full"
                        style={{ width: `${(unlockedAchievements.length / ACHIEVEMENT_BADGES.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-mono text-cyan-400">
                      {Math.round((unlockedAchievements.length / ACHIEVEMENT_BADGES.length) * 100)}%
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                  onClick={() => setLocation('/')}
                >
                  返回遊戲
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
