import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SIGN_IN_REWARDS, SignInReward } from '@/lib/dailyChallenges';
import { Calendar, Gift } from 'lucide-react';

interface SignInRewardsPanelProps {
  onRewardClaimed?: (reward: SignInReward) => void;
}

export function SignInRewardsPanel({ onRewardClaimed }: SignInRewardsPanelProps) {
  const [rewards, setRewards] = useState<SignInReward[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [totalRewardsClaimed, setTotalRewardsClaimed] = useState(0);

  useEffect(() => {
    // 根據本地存儲獲取簽到信息
    const lastSignInDate = localStorage.getItem('lastSignInDate');
    const signInStreak = localStorage.getItem('signInStreak') || '1';
    
    const today = new Date().toDateString();
    let streak = parseInt(signInStreak);
    
    if (lastSignInDate !== today) {
      const lastDate = lastSignInDate ? new Date(lastSignInDate) : new Date();
      const daysDiff = Math.floor(
        (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === 1) {
        streak = (streak % 7) + 1;
      } else if (daysDiff > 1) {
        streak = 1;
      }
      
      localStorage.setItem('lastSignInDate', today);
      localStorage.setItem('signInStreak', streak.toString());
    }
    
    setCurrentDay(streak);
    setRewards(SIGN_IN_REWARDS);
    
    // 計算已領取的獎勵
    const claimedCount = localStorage.getItem('signInRewardsClaimed') || '0';
    setTotalRewardsClaimed(parseInt(claimedCount));
  }, []);

  const handleClaimReward = (reward: SignInReward) => {
    const updated = rewards.map((r) =>
      r.day === reward.day ? { ...r, claimed: true } : r
    );
    setRewards(updated);
    setTotalRewardsClaimed(totalRewardsClaimed + 1);
    
    localStorage.setItem(
      'signInRewardsClaimed',
      (totalRewardsClaimed + 1).toString()
    );
    
    onRewardClaimed?.(reward);
  };

  return (
    <Card className="border-border/50 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-pink-400" />
          每日簽到
        </h2>
        <div className="text-sm text-muted-foreground">
          第 {currentDay} 天 / 7 天
        </div>
      </div>

      <div className="mb-6 p-4 bg-background/50 rounded-lg border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-1">連續簽到</div>
            <div className="text-3xl font-bold text-pink-400">{currentDay}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">已領取獎勵</div>
            <div className="text-3xl font-bold text-cyan-400">{totalRewardsClaimed}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {rewards.map((reward) => (
          <div
            key={reward.day}
            className={`p-3 rounded-lg text-center border-2 transition-all cursor-pointer ${
              reward.day === currentDay
                ? 'border-pink-500 bg-pink-500/20 scale-105'
                : reward.day < currentDay
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-border/50 bg-background/50'
            }`}
          >
            <div className="text-xl mb-1">{reward.icon}</div>
            <div className="text-xs font-bold text-foreground">Day {reward.day}</div>
            <div className="text-xs text-cyan-400 font-mono">+{reward.reward}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rewards.map((reward) => {
          const canClaim = reward.day === currentDay && !reward.claimed;
          const isClaimed = reward.claimed;

          return (
            <div
              key={reward.day}
              className={`p-3 rounded-lg border border-border/50 flex items-center justify-between ${
                isClaimed ? 'bg-green-500/10' : canClaim ? 'bg-pink-500/10' : 'bg-background/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{reward.icon}</span>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    第 {reward.day} 天
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {reward.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-bold text-cyan-400">
                    +{reward.reward}
                  </div>
                  <div className="text-xs text-muted-foreground">分數</div>
                </div>
                <Button
                  size="sm"
                  disabled={!canClaim || isClaimed}
                  onClick={() => handleClaimReward(reward)}
                  className={`text-xs ${
                    isClaimed
                      ? 'bg-gray-600 cursor-not-allowed'
                      : canClaim
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                        : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? '已領取' : canClaim ? '領取' : '鎖定'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-purple-500/10 rounded-lg border border-purple-500/50 text-xs text-muted-foreground">
        <Gift className="w-4 h-4 inline mr-2 text-purple-400" />
        連續簽到 7 天將獲得特殊成就徽章「簽到達人」！
      </div>
    </Card>
  );
}
