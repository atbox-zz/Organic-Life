import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getActiveSeasonalEvents, SeasonalEvent } from '@/lib/dailyChallenges';
import { Flame, TrendingUp } from 'lucide-react';

interface SeasonalEventsPanelProps {
  playerScore: number;
  onEventParticipate?: (event: SeasonalEvent) => void;
}

export function SeasonalEventsPanel({
  playerScore,
  onEventParticipate,
}: SeasonalEventsPanelProps) {
  const [events, setEvents] = useState<SeasonalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SeasonalEvent | null>(null);

  useEffect(() => {
    const activeEvents = getActiveSeasonalEvents();
    setEvents(activeEvents);
    if (activeEvents.length > 0) {
      setSelectedEvent(activeEvents[0]);
    }
  }, []);

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'element_scarcity':
        return '元素稀缺';
      case 'synthesis_marathon':
        return '合成馬拉松';
      case 'cell_evolution_race':
        return '細胞進化競賽';
      case 'molecule_madness':
        return '分子瘋狂';
      default:
        return '未知活動';
    }
  };

  const getEventModifierText = (event: SeasonalEvent) => {
    const modifiers: string[] = [];
    if (event.modifier.elementMultiplier) {
      modifiers.push(
        `元素 ${event.modifier.elementMultiplier === 0.5 ? '減半' : '×' + event.modifier.elementMultiplier}`
      );
    }
    if (event.modifier.scoreMultiplier) {
      modifiers.push(`分數 ×${event.modifier.scoreMultiplier}`);
    }
    if (event.modifier.energyConsumption) {
      modifiers.push(`能量消耗 ×${event.modifier.energyConsumption}`);
    }
    return modifiers.join(' • ');
  };

  if (events.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-400" />
          季節性活動
        </h2>
        <div className="text-center py-8 text-muted-foreground">
          暫無活躍的季節性活動，敬請期待下一季！
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Flame className="w-6 h-6 text-orange-400" />
        季節性活動
      </h2>

      {/* 活動選擇標籤 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold transition-all ${
              selectedEvent?.id === event.id
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-background/50 border border-border/50 text-foreground hover:border-orange-500/50'
            }`}
          >
            {event.icon} {event.name}
          </button>
        ))}
      </div>

      {selectedEvent && (
        <div className="space-y-4">
          {/* 活動詳情 */}
          <div className="p-4 bg-background/50 rounded-lg border border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {selectedEvent.icon} {selectedEvent.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">活動類型</div>
                <div className="text-sm font-bold text-cyan-400">
                  {getEventTypeLabel(selectedEvent.type)}
                </div>
              </div>
            </div>

            {/* 活動修飾符 */}
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/50 mb-4">
              <div className="text-xs text-muted-foreground mb-2">活動效果</div>
              <div className="text-sm text-purple-300">
                {getEventModifierText(selectedEvent)}
              </div>
            </div>

            {/* 活動時間 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 bg-background rounded-lg">
                <div className="text-xs text-muted-foreground">開始日期</div>
                <div className="text-sm font-mono text-cyan-400">
                  {selectedEvent.startDate}
                </div>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <div className="text-xs text-muted-foreground">結束日期</div>
                <div className="text-sm font-mono text-cyan-400">
                  {selectedEvent.endDate}
                </div>
              </div>
            </div>

            {/* 里程碑獎勵 */}
            <div className="mb-4">
              <div className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                里程碑獎勵
              </div>
              <div className="space-y-2">
                {selectedEvent.rewards.map((reward, index) => {
                  const progress = Math.min((playerScore / reward.milestone) * 100, 100);
                  return (
                    <div key={index} className="p-2 bg-background rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-xs text-muted-foreground">
                          {reward.milestone} 分里程碑
                        </div>
                        <div className="text-sm font-bold text-yellow-400">
                          +{reward.reward} 獎勵
                        </div>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {playerScore} / {reward.milestone}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 參與按鈕 */}
            <Button
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              onClick={() => onEventParticipate?.(selectedEvent)}
            >
              參與活動
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
