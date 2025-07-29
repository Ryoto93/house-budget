/*
  Warnings:

  - You are about to alter the column `events` on the `simulations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `result` on the `simulations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_simulations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "baseDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "events" JSONB NOT NULL,
    "result" JSONB NOT NULL
);
INSERT INTO "new_simulations" ("baseDate", "endDate", "events", "id", "name", "result") SELECT "baseDate", "endDate", "events", "id", "name", "result" FROM "simulations";
DROP TABLE "simulations";
ALTER TABLE "new_simulations" RENAME TO "simulations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
