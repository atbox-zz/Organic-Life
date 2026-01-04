import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TimedChallenge,
  generateRandomTimedChallenge,
  getRemainingTime,
  isChallengeExpired,
  getChallengeProgress,
  getDifficultyColor,
} from '@/lib/timedChallenges';
import { AlertCircle, Zap, RotateCcw } from 'lucide-react';

interface TimedChallengePanelProps {
  playerScore: number;
  onChallengeStart?: (challenge: TimedChallenge) => void;
  onChallengeComplete?: (challenge: TimedChallenge) => void;
}

export function TimedChallengePanel({
  playerScore,
  onChallengeStart,
  onChallengeComplete,
}: TimedChallengePanelProps) {
  const [challenge, setChallenge] = useState<TimedChallenge | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // 從 localStorage 加載或生成新挑戰
    const savedChallenge = localStorage.getItem('currentTimedChallenge');
    if (savedChallenge) {
      const parsed = JSON.parse(savedChallenge);
      if (!isChallengeExpired(parsed)) {
        setChallenge(parsed);
        setIsActive(true);
      } else {
        localStorage.removeItem('currentTimedChallenge');
      }
    }
  }, []);

  // 更新計時器
  useEffect(() => {
    if (!challenge || !isActive) return;

    const interval = setInterval(() => {
      const remaining = getRemainingTime(challenge);
      setRemainingTime(remaining);
      setProgress(getChallengeProgress(challenge));

      if (remaining <= 0) {
        setIsActive(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [challenge, isActive]);

  const handleStartChallenge = () => {
    const newChallenge = generateRandomTimedChallenge();
    setChallenge(newChallenge);
    setIsActive(true);
    setRemainingTime(newChallenge.durationSeconds);
    localStorage.setItem('currentTimedChallenge', JSON.stringify(newChallenge));
    onChallengeStart?.(newChallenge);
  };

  const handleCompleteChallenge = () => {
    if (challenge && playerScore >= challenge.targetScore) {
      const completed = { ...challenge, completed: true };
      setChallenge(completed);
      setIsActive(false);
      onChallengeComplete?.(completed);
    }
  };

  const handleGenerateNew = () => {
    localStorage.removeItem('currentTimedChallenge');
    setChallenge(null);
    setIsActive(false);
    handleStartChallenge();
  };

  if (!challenge || !isActive) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-400" />
            限時挑戰
          </h2>
          <div className="text-sm text-muted-foreground">
            {challenge?.completed ? '已完成' : '等待中'}
          </div>
        </div>

        {challenge?.completed && (
          <div className="mb-4 p-4 bg-green-500/20 rounded-lg border border-green-500/50">
            <div className="text-sm font-bold text-green-400 mb-2">
              ✓ 挑戰完成！
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              獲得 +{challenge.rewards.score} 分和 +{challenge.rewards.bonus} 額外獎勵
            </div>
            <Button
              size="sm"
              onClick={handleGenerateNew}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              生成新挑戰
            </Button>
          </div>
        )}

        {!challenge?.completed && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              準備好迎接極限挑戰了嗎？點擊下方按鈕開始隨機限時挑戰！
            </p>
            <Button
              onClick={handleStartChallenge}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
            >
              <Zap className="w-4 h-4 mr-2" />
              開始限時挑戰
            </Button>
          </div>
        )}
      </Card>
    );
  }

  const isProgressMet = playerScore >= challenge.targetScore;
  const progressPercent = (playerScore / challenge.targetScore) * 100;
  const timePercent = (remainingTime / challenge.durationSeconds) * 100;

  return (
    <Card className="border-red-500/50 bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-400 animate-bounce" />
          {challenge.icon} {challenge.name}
        </h2>
        <div className={`text-2xl font-bold ${getDifficultyColor(challenge.difficulty)}`}>
          {remainingTime}s
        </div>
      </div>

      {/* 挑戰描述 */}
      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

      {/* 時間進度條 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>時間剩餘</span>
          <span>{remainingTime} / {challenge.durationSeconds} 秒</span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              timePercent > 30
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500'
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}
            style={{ width: `${timePercent}%` }}
          ></div>
        </div>
      </div>

      {/* 分數進度條 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>分數進度</span>
          <span>{playerScore} / {challenge.targetScore}</span>
        </div>
        <div className="w-full bg-background rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isProgressMet
                ? 'bg-gradient-to-r from-green-500 to-lime-500'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 修飾符信息 */}
      <div className="p-3 bg-background/50 rounded-lg border border-border/50 mb-4">
        <div className="text-xs font-bold text-foreground mb-2">挑戰修飾符：</div>
        <div className="text-xs text-cyan-400 space-y-1">
          {challenge.modifier.scoreMultiplier && (
            <div>✓ 分數獎勵 ×{challenge.modifier.scoreMultiplier}</div>
          )}
          {challenge.modifier.energyConsumption && (
            <div>⚠ 能量消耗 ×{challenge.modifier.energyConsumption}</div>
          )}
          {challenge.modifier.elementReduction && (
            <div>⚠ 元素供應 ×{challenge.modifier.elementReduction}</div>
          )}
          {challenge.modifier.elementConsumption && (
            <div>✓ 元素消耗 ×{challenge.modifier.elementConsumption}</div>
          )}
        </div>
      </div>

      {/* 獎勵信息 */}
      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/50 mb-4">
        <div className="text-xs font-bold text-yellow-400 mb-2">完成獎勵：</div>
        <div className="text-sm">
          <div className="text-cyan-400">+{challenge.rewards.score} 分</div>
          <div className="text-yellow-400">+{challenge.rewards.bonus} 額外獎勵</div>
          {challenge.rewards.limitedAchievement && (
            <div className="text-purple-400">
              🏆 限時成就：{challenge.rewards.limitedAchievement}
            </div>
          )}
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-2">
        <Button
          disabled={!isProgressMet}
          onClick={handleCompleteChallenge}
          className={`flex-1 text-white font-bold ${
            isProgressMet
              ? 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {isProgressMet ? '✓ 完成挑戰' : '進行中...'}
        </Button>
      </div>

      {remainingTime < 30 && (
        <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-500/50">
          <div className="text-xs text-red-400 font-bold">
            ⏰ 時間即將耗盡！快速完成挑戰！
          </div>
        </div>
      )}
    </Card>
  );
}
