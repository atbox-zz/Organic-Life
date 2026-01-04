import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

// 內存中的全球排行榜（實際應用應使用數據庫）
const globalLeaderboard: Array<{
  rank: number;
  playerName: string;
  score: number;
  level: number;
  date: string;
  cellType: string;
}> = [
  { rank: 1, playerName: "量子科學家", score: 5000, level: 15, date: "2025-12-31", cellType: "動物細胞" },
  { rank: 2, playerName: "分子工程師", score: 4500, level: 14, date: "2025-12-30", cellType: "植物細胞" },
  { rank: 3, playerName: "生命探索者", score: 4200, level: 13, date: "2025-12-29", cellType: "真菌細胞" },
  { rank: 4, playerName: "元素收集家", score: 3800, level: 12, date: "2025-12-28", cellType: "原核細胞" },
  { rank: 5, playerName: "合成大師", score: 3500, level: 11, date: "2025-12-27", cellType: "病毒" },
];

export const leaderboardRouter = router({
  // 獲取全球排行榜
  getGlobalLeaderboard: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(({ input }) => {
      const { limit, offset } = input;
      const paginated = globalLeaderboard.slice(offset, offset + limit);
      return {
        leaderboard: paginated,
        total: globalLeaderboard.length,
        hasMore: offset + limit < globalLeaderboard.length,
      };
    }),

  // 提交分數到排行榜
  submitScore: publicProcedure
    .input(z.object({
      playerName: z.string().min(1).max(50),
      score: z.number().min(0),
      level: z.number().min(1),
      cellType: z.string(),
    }))
    .mutation(({ input }) => {
      const { playerName, score, level, cellType } = input;

      // 檢查分數是否足以進入排行榜
      const lowestScore = globalLeaderboard[globalLeaderboard.length - 1]?.score || 0;
      
      if (score > lowestScore || globalLeaderboard.length < 10) {
        // 添加新條目
        const newEntry = {
          rank: globalLeaderboard.length + 1,
          playerName,
          score,
          level,
          date: new Date().toISOString().split('T')[0],
          cellType,
        };

        // 添加到排行榜
        globalLeaderboard.push(newEntry);

        // 按分數排序並重新編號
        globalLeaderboard.sort((a, b) => b.score - a.score);
        globalLeaderboard.forEach((entry, index) => {
          entry.rank = index + 1;
        });

        // 只保留前 10 名
        globalLeaderboard.splice(10);

        return {
          success: true,
          rank: newEntry.rank,
          message: `恭喜！您進入全球排行榜第 ${newEntry.rank} 名！`,
        };
      }

      return {
        success: false,
        message: `您的分數 ${score} 未能進入排行榜。`,
      };
    }),

  // 獲取玩家排名
  getPlayerRank: publicProcedure
    .input(z.object({
      playerName: z.string().min(1).max(50),
    }))
    .query(({ input }) => {
      const entry = globalLeaderboard.find(e => e.playerName === input.playerName);
      return entry || null;
    }),

  // 獲取排行榜統計信息
  getStats: publicProcedure
    .query(() => {
      const totalPlayers = globalLeaderboard.length;
      const avgScore = globalLeaderboard.reduce((sum, e) => sum + e.score, 0) / totalPlayers || 0;
      const maxScore = globalLeaderboard[0]?.score || 0;
      const minScore = globalLeaderboard[globalLeaderboard.length - 1]?.score || 0;

      return {
        totalPlayers,
        avgScore: Math.round(avgScore),
        maxScore,
        minScore,
        topPlayer: globalLeaderboard[0]?.playerName || "未知",
      };
    }),
});
