/*
  Warnings:

  - You are about to alter the column `balance` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `amount` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `amount` on the `transaction_templates` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_accounts" ("balance", "currency", "id", "lastUpdated", "name", "type") SELECT "balance", "currency", "id", "lastUpdated", "name", "type" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE TABLE "new_budgets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'monthly',
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    CONSTRAINT "budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_budgets" ("amount", "categoryId", "id", "month", "period", "year") SELECT "amount", "categoryId", "id", "month", "period", "year" FROM "budgets";
DROP TABLE "budgets";
ALTER TABLE "new_budgets" RENAME TO "budgets";
CREATE UNIQUE INDEX "budgets_categoryId_year_month_key" ON "budgets"("categoryId", "year", "month");
CREATE TABLE "new_transaction_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "description" TEXT NOT NULL,
    CONSTRAINT "transaction_templates_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transaction_templates_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transaction_templates" ("accountId", "amount", "categoryId", "description", "id", "name", "paymentMethod", "type") SELECT "accountId", "amount", "categoryId", "description", "id", "name", "paymentMethod", "type" FROM "transaction_templates";
DROP TABLE "transaction_templates";
ALTER TABLE "new_transaction_templates" RENAME TO "transaction_templates";
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "description" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringDay" INTEGER,
    CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("accountId", "amount", "categoryId", "date", "description", "id", "isRecurring", "paymentMethod", "recurringDay", "type") SELECT "accountId", "amount", "categoryId", "date", "description", "id", "isRecurring", "paymentMethod", "recurringDay", "type" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
