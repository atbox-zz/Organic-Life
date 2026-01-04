import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BiomoleculeRecipe, ALL_BIOMOLECULES } from '@/lib/biomolecules';

interface MoleculeSelectorProps {
  onSelect: (molecule: BiomoleculeRecipe) => void;
  selectedMolecule?: BiomoleculeRecipe;
  availableElements: Record<string, number>;
}

export function MoleculeSelector({
  onSelect,
  selectedMolecule,
  availableElements,
}: MoleculeSelectorProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredMolecules =
    filterType === 'all'
      ? ALL_BIOMOLECULES
      : ALL_BIOMOLECULES.filter(m => m.type === filterType);

  const canSynthesize = (molecule: BiomoleculeRecipe): boolean => {
    return Object.entries(molecule.elements).every(
      ([element, required]) =>
        availableElements[element as keyof typeof molecule.elements] >= required
    );
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
      <h3 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: 'Poppins' }}>
        分子合成
      </h3>

      {/* 分子類型篩選 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          className="text-xs h-8 whitespace-nowrap"
          onClick={() => setFilterType('all')}
        >
          全部
        </Button>
        <Button
          variant={filterType === 'carbohydrate' ? 'default' : 'outline'}
          className="text-xs h-8 whitespace-nowrap"
          onClick={() => setFilterType('carbohydrate')}
        >
          糖類
        </Button>
        <Button
          variant={filterType === 'protein' ? 'default' : 'outline'}
          className="text-xs h-8 whitespace-nowrap"
          onClick={() => setFilterType('protein')}
        >
          蛋白質
        </Button>
        <Button
          variant={filterType === 'dna' ? 'default' : 'outline'}
          className="text-xs h-8 whitespace-nowrap"
          onClick={() => setFilterType('dna')}
        >
          核酸
        </Button>
        <Button
          variant={filterType === 'lipid' ? 'default' : 'outline'}
          className="text-xs h-8 whitespace-nowrap"
          onClick={() => setFilterType('lipid')}
        >
          脂肪
        </Button>
      </div>

      {/* 分子列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredMolecules.map((molecule) => {
          const canMake = canSynthesize(molecule);
          const isSelected = selectedMolecule?.id === molecule.id;

          return (
            <div
              key={molecule.id}
              className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : canMake
                    ? 'border-border/50 bg-background/50 hover:bg-background/80'
                    : 'border-border/30 bg-background/30 opacity-50'
              }`}
              onClick={() => canMake && onSelect(molecule)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{molecule.icon}</span>
                    <div>
                      <h4 className="font-bold text-foreground text-sm" style={{ fontFamily: 'Poppins' }}>
                        {molecule.chineseName}
                      </h4>
                      <p className="text-xs text-muted-foreground">{molecule.formula}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{molecule.description}</p>
                </div>
                <div className="text-right ml-2">
                  <div className="text-xs text-lime-400 font-mono">+{molecule.scoreReward}</div>
                  <div className="text-xs text-cyan-400 font-mono">+{molecule.healthReward}❤️</div>
                </div>
              </div>

              {/* 元素需求 */}
              <div className="mt-2 grid grid-cols-6 gap-1 text-xs">
                {Object.entries(molecule.elements).map(([elem, required]) => {
                  if (required === 0) return null;
                  const available = availableElements[elem] || 0;
                  const isSufficient = available >= required;

                  return (
                    <div
                      key={elem}
                      className={`text-center p-1 rounded ${
                        isSufficient
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      <div className="font-bold">{elem}</div>
                      <div className="text-xs">
                        {available}/{required}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 難度指示 */}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  難度：
                  <span
                    className={
                      molecule.difficulty === 'easy'
                        ? 'text-green-400'
                        : molecule.difficulty === 'medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }
                  >
                    {molecule.difficulty === 'easy'
                      ? '簡單'
                      : molecule.difficulty === 'medium'
                        ? '中等'
                        : '困難'}
                  </span>
                </div>
                {!canMake && <span className="text-xs text-red-400">元素不足</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/**
 * 分子詳情卡片
 */
interface MoleculeDetailProps {
  molecule: BiomoleculeRecipe;
}

export function MoleculeDetail({ molecule }: MoleculeDetailProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-4xl">{molecule.icon}</div>
        <div>
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Poppins' }}>
            {molecule.chineseName}
          </h3>
          <p className="text-sm text-muted-foreground">{molecule.formula}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{molecule.scientificInfo}</p>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-background/50 p-2 rounded">
          <div className="text-muted-foreground">分數獎勵</div>
          <div className="text-lime-400 font-bold">+{molecule.scoreReward}</div>
        </div>
        <div className="bg-background/50 p-2 rounded">
          <div className="text-muted-foreground">健康度</div>
          <div className="text-cyan-400 font-bold">+{molecule.healthReward}</div>
        </div>
        <div className="bg-background/50 p-2 rounded">
          <div className="text-muted-foreground">能量消耗</div>
          <div className="text-orange-400 font-bold">-{molecule.energyCost}</div>
        </div>
      </div>
    </Card>
  );
}
