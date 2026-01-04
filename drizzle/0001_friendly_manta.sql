CREATE TABLE `gameProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentScore` int NOT NULL DEFAULT 0,
	`currentLevel` int NOT NULL DEFAULT 1,
	`currentEnergy` int NOT NULL DEFAULT 100,
	`currentHealth` int NOT NULL DEFAULT 100,
	`currentCellId` varchar(32) NOT NULL DEFAULT 'prokaryote',
	`unlockedCells` text NOT NULL DEFAULT ('["prokaryote"]'),
	`achievementsUnlocked` text NOT NULL DEFAULT ('[]'),
	`moleculesCreated` text NOT NULL DEFAULT ('[]'),
	`elements` text NOT NULL DEFAULT ('{"C": 10, "H": 15, "O": 8, "N": 3, "P": 2, "S": 1}'),
	`lastPlayedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gameProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `gameProgress_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`totalMonomers` int NOT NULL DEFAULT 0,
	`totalMacromolecules` int NOT NULL DEFAULT 0,
	`cellsUnlocked` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);
