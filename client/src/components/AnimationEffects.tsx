import React, { useEffect, useState } from 'react';

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  color: string;
  duration: number;
}

interface AnimationEffectsProps {
  particles: ParticleEffect[];
}

export function AnimationEffects({ particles }: AnimationEffectsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} />
      ))}
    </div>
  );
}

function Particle({ particle }: { particle: ParticleEffect }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, particle.duration);

    return () => clearTimeout(timer);
  }, [particle.duration]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-pulse"
      style={{
        left: `${particle.x}px`,
        top: `${particle.y}px`,
        backgroundColor: particle.color,
        boxShadow: `0 0 10px ${particle.color}`,
        animation: `particle-burst ${particle.duration}ms ease-out forwards`,
      }}
    />
  );
}

/**
 * 脈衝動畫組件 - 用於強調操作反饋
 */
interface PulseEffectProps {
  isActive: boolean;
  color?: string;
  duration?: number;
}

export function PulseEffect({
  isActive,
  color = '#06b6d4',
  duration = 600,
}: PulseEffectProps) {
  return (
    <div
      className={`absolute inset-0 rounded-lg pointer-events-none ${
        isActive ? 'animate-pulse' : ''
      }`}
      style={{
        backgroundColor: color,
        opacity: isActive ? 0.2 : 0,
        animation: isActive
          ? `pulse-ring ${duration}ms ease-out forwards`
          : 'none',
      }}
    />
  );
}

/**
 * 浮起動畫組件 - 用於分數增加提示
 */
interface FloatingTextProps {
  text: string;
  x: number;
  y: number;
  color?: string;
  duration?: number;
}

export function FloatingText({
  text,
  x,
  y,
  color = '#84cc16',
  duration = 1000,
}: FloatingTextProps) {
  return (
    <div
      className="fixed font-bold text-lg pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        color: color,
        textShadow: `0 0 10px ${color}`,
        animation: `float-up ${duration}ms ease-out forwards`,
        fontFamily: 'Poppins',
      }}
    >
      {text}
    </div>
  );
}

/**
 * 全局動畫樣式
 */
export const animationStyles = `
  @keyframes particle-burst {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
    }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  @keyframes float-up {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-60px);
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.8);
    }
  }

  @keyframes scale-pop {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
