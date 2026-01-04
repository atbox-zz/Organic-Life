import { useGame, ElementType } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';

interface ElementInfo {
  type: ElementType;
  name: string;
  symbol: string;
  color: string;
  glowColor: string;
}

const ELEMENTS: ElementInfo[] = [
  { type: 'C', name: '碳', symbol: 'C', color: '#06b6d4', glowColor: 'glow-cyan' },
  { type: 'H', name: '氫', symbol: 'H', color: '#0d9488', glowColor: 'glow-teal' },
  { type: 'O', name: '氧', symbol: 'O', color: '#a855f7', glowColor: 'glow-purple' },
  { type: 'N', name: '氮', symbol: 'N', color: '#84cc16', glowColor: 'glow-lime' },
  { type: 'P', name: '磷', symbol: 'P', color: '#f59e0b', glowColor: 'glow-amber' },
  { type: 'S', name: '硫', symbol: 'S', color: '#ef4444', glowColor: 'glow-red' },
];

export function ElementPanel() {
  const { gameState } = useGame();

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">元素庫存</h2>
        <div className="text-sm text-muted-foreground font-mono">Lv. {gameState.level}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {ELEMENTS.map((element) => {
          const count = gameState.elements[element.type];
          return (
            <Card
              key={element.type}
              className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 cursor-pointer group"
            >
              {/* 背景光暈效果 */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: element.color }}
              />

              <div className="relative p-4 flex flex-col items-center justify-center gap-2">
                {/* 元素符號 */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg border-2 group-hover:animate-glow transition-all duration-300"
                  style={{
                    borderColor: element.color,
                    color: element.color,
                    boxShadow: `0 0 10px ${element.color}40`,
                  }}
                >
                  {element.symbol}
                </div>

                {/* 元素名稱 */}
                <div className="text-xs text-muted-foreground text-center">
                  {element.name}
                </div>

                {/* 數量顯示 */}
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-foreground">
                    {count}
                  </div>
                  <div className="text-xs text-muted-foreground">個</div>
                </div>
              </div>

              {/* 邊框光暈 */}
              <div
                className="absolute inset-0 border-2 border-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  borderColor: element.color,
                  boxShadow: `inset 0 0 20px ${element.color}20`,
                }}
              />
            </Card>
          );
        })}
      </div>

      {/* 統計信息 */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-3">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">總元素數</span>
            <span className="text-foreground font-mono font-bold">
              {Object.values(gameState.elements).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">已創建單體</span>
            <span className="text-foreground font-mono font-bold">
              {gameState.monomers.length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
