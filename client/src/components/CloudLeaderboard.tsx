import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Loader2, Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  level: number;
  date: string;
  cellType: string;
}

export function CloudLeaderboard() {
  const [playerName, setPlayerName] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // 獲取全球排行榜
  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = trpc.leaderboard.getGlobalLeaderboard.useQuery({
    limit: 10,
    offset: 0,
  });

  // 獲取排行榜統計
  const { data: statsData } = trpc.leaderboard.getStats.useQuery();

  // 提交分數
  const submitScoreMutation = trpc.leaderboard.submitScore.useMutation();

  const handleSubmitScore = async (score: number, level: number, cellType: string) => {
    if (!playerName.trim()) {
      alert('請輸入玩家名稱');
      return;
    }

    submitScoreMutation.mutate(
      {
        playerName: playerName.trim(),
        score,
        level,
        cellType,
      },
      {
        onSuccess: (result) => {
          alert(result.message);
          setPlayerName('');
          setShowSubmitForm(false);
        },
        onError: (error) => {
          alert('提交失敗：' + error.message);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* 排行榜統計 */}
      {statsData && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">總玩家數</div>
              <div className="text-2xl font-bold text-cyan-400">{statsData.totalPlayers}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">平均分數</div>
              <div className="text-2xl font-bold text-lime-400">{statsData.avgScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">最高分</div>
              <div className="text-2xl font-bold text-purple-400">{statsData.maxScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">最低分</div>
              <div className="text-2xl font-bold text-orange-400">{statsData.minScore}</div>
            </div>
          </div>
        </Card>
      )}

      {/* 全球排行榜 */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-foreground">全球排行榜</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="text-xs"
          >
            提交分數
          </Button>
        </div>

        {/* 提交分數表單 */}
        {showSubmitForm && (
          <div className="mb-4 p-3 bg-background/50 rounded-lg border border-border/50">
            <input
              type="text"
              placeholder="輸入玩家名稱"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border/50 rounded text-foreground text-sm mb-2"
            />
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
              onClick={() => handleSubmitScore(0, 1, '原核細胞')}
              disabled={submitScoreMutation.isPending}
            >
              {submitScoreMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交'
              )}
            </Button>
          </div>
        )}

        {/* 排行榜列表 */}
        {isLoadingLeaderboard ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData?.leaderboard.map((entry: LeaderboardEntry) => (
              <div
                key={`${entry.rank}-${entry.playerName}`}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50 hover:border-border/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center font-bold text-white text-sm">
                    {entry.rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">{entry.playerName}</div>
                    <div className="text-xs text-muted-foreground">{entry.cellType} • Lv. {entry.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-cyan-400">{entry.score}</div>
                  <div className="text-xs text-muted-foreground">{entry.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {leaderboardData && leaderboardData.hasMore && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => {
              // 可以實現分頁加載
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            查看更多
          </Button>
        )}
      </Card>
    </div>
  );
}
