import { useCallback } from 'react';

type SoundType = 'synthesis' | 'assembly' | 'collect' | 'success' | 'error' | 'levelup';

/**
 * 音效反饋 Hook
 * 使用 Web Audio API 生成程序化音效，無需外部音頻文件
 */
export function useAudioFeedback() {
  const playSound = useCallback((type: SoundType) => {
    // 檢查瀏覽器是否支持 Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    switch (type) {
      case 'synthesis': {
        // 單體合成音效：上升的音調
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'assembly': {
        // 大分子組裝音效：多個音調的和弦
        const now = audioContext.currentTime;
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

          osc.start(now + index * 0.05);
          osc.stop(now + 0.4 + index * 0.05);
        });
        break;
      }

      case 'collect': {
        // 元素收集音效：短促的上升音調
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'success': {
        // 成功音效：上升的三音和弦
        const now = audioContext.currentTime;
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

        frequencies.forEach((freq) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

          osc.start(now);
          osc.stop(now + 0.3);
        });
        break;
      }

      case 'error': {
        // 錯誤音效：下降的音調
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'levelup': {
        // 升級音效：上升的雙音調
        const now = audioContext.currentTime;
        const frequencies = [523.25, 783.99]; // C5, G5

        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.1);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.2 + index * 0.1);

          gain.gain.setValueAtTime(0.3, now + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2 + index * 0.1);

          osc.start(now + index * 0.1);
          osc.stop(now + 0.2 + index * 0.1);
        });
        break;
      }
    }
  }, []);

  return { playSound };
}
