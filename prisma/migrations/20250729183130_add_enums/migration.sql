-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "balance" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_accounts" ("balance", "currency", "id", "lastUpdated", "name", "type") SELECT "balance", "currency", "id", "lastUpdated", "name", "type" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE TABLE "new_budgets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'monthly',
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    CONSTRAINT "budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_budgets" ("amount", "categoryId", "id", "month", "period", "year") SELECT "amount", "categoryId", "id", "month", "period", "year" FROM "budgets";
DROP TABLE "budgets";
ALTER TABLE "new_budgets" RENAME TO "budgets";
CREATE UNIQUE INDEX "budgets_categoryId_year_month_key" ON "budgets"("categoryId", "year", "month");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
