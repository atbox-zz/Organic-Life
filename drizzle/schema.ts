import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 遊戲排行榜表
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  score: int("score").notNull().default(0),
  level: int("level").notNull().default(1),
  totalMonomers: int("totalMonomers").notNull().default(0),
  totalMacromolecules: int("totalMacromolecules").notNull().default(0),
  cellsUnlocked: int("cellsUnlocked").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;

// 玩家遊戲進度表
export const gameProgress = mysqlTable("gameProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentScore: int("currentScore").notNull().default(0),
  currentLevel: int("currentLevel").notNull().default(1),
  currentEnergy: int("currentEnergy").notNull().default(100),
  currentHealth: int("currentHealth").notNull().default(100),
  currentCellId: varchar("currentCellId", { length: 32 }).notNull().default("prokaryote"),
  unlockedCells: text("unlockedCells").notNull(),
  achievementsUnlocked: text("achievementsUnlocked").notNull(),
  moleculesCreated: text("moleculesCreated").notNull(),
  elements: text("elements").notNull(),
  lastPlayedAt: timestamp("lastPlayedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = typeof gameProgress.$inferInsert;

// 設置默認值的輔助函數
export function createDefaultGameProgress(userId: number): InsertGameProgress {
  return {
    userId,
    currentScore: 0,
    currentLevel: 1,
    currentEnergy: 100,
    currentHealth: 100,
    currentCellId: 'prokaryote',
    unlockedCells: JSON.stringify(['prokaryote']),
    achievementsUnlocked: JSON.stringify([]),
    moleculesCreated: JSON.stringify([]),
    elements: JSON.stringify({ C: 10, H: 15, O: 8, N: 3, P: 2, S: 1 }),
    lastPlayedAt: new Date(),
  };
}