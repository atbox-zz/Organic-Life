import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTodaysChallenges, DailyChallenge } from '@/lib/dailyChallenges';
import { CheckCircle2, Circle, Zap } from 'lucide-react';

interface DailyChallengePanelProps {
  playerScore: number;
  onChallengeComplete?: (challenge: DailyChallenge) => void;
}

export function DailyChallengesPanel({
  playerScore,
  onChallengeComplete,
}: DailyChallengePanelProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const todaysChallenges = getTodaysChallenges();
    setChallenges(todaysChallenges);
  }, []);

  const handleClaimReward = (challenge: DailyChallenge) => {
    const updated = challenges.map((c) =>
      c.id === challenge.id ? { ...c, completed: true } : c
    );
    setChallenges(updated);
    setCompletedCount(completedCount + 1);
    onChallengeComplete?.(challenge);
  };

  const isProgressMet = (challenge: DailyChallenge) => {
    return playerScore >= challenge.targetScore;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          每日挑戰
        </h2>
        <div className="text-sm text-muted-foreground">
          {completedCount} / {challenges.length} 完成
        </div>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isComplete = isProgressMet(challenge);
          const isClaimed = challenge.completed;

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isClaimed
                  ? 'border-green-500/50 bg-green-500/10'
                  : isComplete
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : 'border-border/50 bg-background/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{challenge.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isClaimed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : isComplete ? (
                    <Circle className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>進度</span>
                    <span>
                      {playerScore} / {challenge.targetScore}
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((playerScore / challenge.targetScore) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="text-cyan-400 font-bold">
                    +{challenge.reward.score} 分
                  </div>
                  <div className="text-xs text-yellow-400">
                    +{challenge.reward.bonus} 額外獎勵
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={!isComplete || isClaimed}
                  onClick={() => handleClaimReward(challenge)}
                  className={`text-xs ${
                    isClaimed
                      ? 'bg-gray-600 cursor-not-allowed'
                      : isComplete
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700'
                        : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? '已領取' : isComplete ? '領取獎勵' : '進行中'}
                </Button>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                難度：
                <span
                  className={
                    challenge.difficulty === 'easy'
                      ? 'text-green-400'
                      : challenge.difficulty === 'medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {challenge.difficulty === 'easy'
                    ? '簡單'
                    : challenge.difficulty === 'medium'
                      ? '中等'
                      : '困難'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
