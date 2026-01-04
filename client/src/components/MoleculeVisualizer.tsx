import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface Atom {
  x: number;
  y: number;
  vx: number;
  vy: number;
  element: string;
  color: string;
  radius: number;
}

interface Bond {
  from: number;
  to: number;
  color: string;
}

interface MoleculeProps {
  atoms: Atom[];
  bonds: Bond[];
  title?: string;
}

export function MoleculeVisualizer({ atoms, bonds, title = '分子結構' }: MoleculeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const atomsRef = useRef<Atom[]>(atoms);

  useEffect(() => {
    atomsRef.current = atoms;
  }, [atoms]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx as CanvasRenderingContext2D;

    const width = canvas.width;
    const height = canvas.height;

    const animate = (): void => {
      // 清空畫布
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // 更新原子位置（簡單物理模擬）
      atomsRef.current.forEach((atom, i) => {
        // 應用重力指向中心
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - atom.x;
        const dy = centerY - atom.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 50) {
          atom.vx += (dx / dist) * 0.1;
          atom.vy += (dy / dist) * 0.1;
        }

        // 應用阻力
        atom.vx *= 0.95;
        atom.vy *= 0.95;

        // 更新位置
        atom.x += atom.vx;
        atom.y += atom.vy;

        // 邊界碰撞
        if (atom.x - atom.radius < 0) atom.x = atom.radius;
        if (atom.x + atom.radius > width) atom.x = width - atom.radius;
        if (atom.y - atom.radius < 0) atom.y = atom.radius;
        if (atom.y + atom.radius > height) atom.y = height - atom.radius;
      });

      // 繪製化學鍵
      bonds.forEach((bond) => {
        const from = atomsRef.current[bond.from];
        const to = atomsRef.current[bond.to];

        ctx.strokeStyle = bond.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // 繪製原子
      atomsRef.current.forEach((atom) => {
        // 外圈光暈
        ctx.fillStyle = atom.color;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 原子圓圈
        ctx.fillStyle = atom.color;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);
        ctx.fill();

        // 邊框
        ctx.strokeStyle = atom.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 元素符號
        ctx.fillStyle = '#0f172a';
        ctx.globalAlpha = 1;
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, atom.x, atom.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bonds]);

  return (
    <Card className="w-full h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-lg font-display font-bold text-foreground">{title}</h3>
      </div>
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>
    </Card>
  );
}

// 預設分子示例
export const EXAMPLE_MOLECULES = {
  glucose: {
    atoms: [
      { x: 250, y: 150, vx: 0, vy: 0, element: 'C', color: '#06b6d4', radius: 8 },
      { x: 280, y: 180, vx: 0, vy: 0, element: 'C', color: '#06b6d4', radius: 8 },
      { x: 250, y: 210, vx: 0, vy: 0, element: 'C', color: '#06b6d4', radius: 8 },
      { x: 220, y: 180, vx: 0, vy: 0, element: 'C', color: '#06b6d4', radius: 8 },
      { x: 310, y: 150, vx: 0, vy: 0, element: 'H', color: '#0d9488', radius: 6 },
      { x: 280, y: 120, vx: 0, vy: 0, element: 'O', color: '#a855f7', radius: 7 },
    ] as Atom[],
    bonds: [
      { from: 0, to: 1, color: '#06b6d4' },
      { from: 1, to: 2, color: '#06b6d4' },
      { from: 2, to: 3, color: '#06b6d4' },
      { from: 3, to: 0, color: '#06b6d4' },
      { from: 0, to: 4, color: '#0d9488' },
      { from: 1, to: 5, color: '#a855f7' },
    ],
  },
};
