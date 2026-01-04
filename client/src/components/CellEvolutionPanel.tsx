import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CellType, getAvailableCells, getNextCell, getCellEvolutionProgress } from '@/lib/cellEvolution';
import { Lock, Unlock, Zap } from 'lucide-react';

interface CellEvolutionPanelProps {
  level: number;
  score: number;
  currentCell: CellType;
  onCellChange?: (cell: CellType) => void;
}

export function CellEvolutionPanel({
  level,
  score,
  currentCell,
  onCellChange,
}: CellEvolutionPanelProps) {
  const availableCells = getAvailableCells(level, score);
  const nextCell = getNextCell(level, score);
  const { progressPercent } = getCellEvolutionProgress(level, score);

  return (
    <div className="space-y-4">
      {/* 當前細胞展示 */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-6 overflow-hidden relative">
        {/* 背景光暈 */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ backgroundColor: currentCell.glowColor }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">{currentCell.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Poppins' }}>
                  {currentCell.chineseName}
                </h3>
                <p className="text-xs text-muted-foreground">{currentCell.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">等級需求</div>
              <div className="text-2xl font-mono font-bold" style={{ color: currentCell.color }}>
                Lv. {currentCell.unlockLevel}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {currentCell.description}
          </p>

          {/* 特殊能力 */}
          <div className="bg-background/50 rounded-lg p-3 mb-4 border border-border/50">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentCell.color }} />
              <div>
                <div className="text-xs font-bold text-foreground mb-1">特殊能力</div>
                <div className="text-xs text-muted-foreground">{currentCell.specialAbility}</div>
              </div>
            </div>
          </div>

          {/* 科學信息 */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {currentCell.scientificInfo}
          </p>

          {/* 特徵標籤 */}
          <div className="flex flex-wrap gap-2">
            {currentCell.characteristics.map((char) => (
              <span
                key={char}
                className="px-2 py-1 text-xs rounded-full border"
                style={{
                  borderColor: currentCell.color,
                  color: currentCell.color,
                  backgroundColor: `${currentCell.glowColor}`,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* 進化進度 */}
      {nextCell && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-foreground" style={{ fontFamily: 'Poppins' }}>
                下一步進化
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-2 bg-card rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
            <div className="text-3xl">{nextCell.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">
                {nextCell.chineseName}
              </div>
              <div className="text-xs text-muted-foreground">
                需要 Lv. {nextCell.unlockLevel} 和 {nextCell.unlockScore} 分數
              </div>
            </div>
            <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
        </Card>
      )}

      {/* 可用細胞列表 */}
      {availableCells.length > 1 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
          <h4 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Poppins' }}>
            已解鎖的細胞
          </h4>
          <div className="space-y-2">
            {availableCells.map((cell) => (
              <button
                key={cell.id}
                onClick={() => onCellChange?.(cell)}
                className={`w-full p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                  currentCell.id === cell.id
                    ? 'border-current bg-background/80'
                    : 'border-border/50 bg-background/30 hover:bg-background/50'
                }`}
                style={{
                  borderColor: currentCell.id === cell.id ? cell.color : undefined,
                  boxShadow:
                    currentCell.id === cell.id ? `0 0 12px ${cell.glowColor}` : undefined,
                }}
              >
                <div className="text-2xl">{cell.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">
                    {cell.chineseName}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {cell.description}
                  </div>
                </div>
                <Unlock className="w-4 h-4 flex-shrink-0" style={{ color: cell.color }} />
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
