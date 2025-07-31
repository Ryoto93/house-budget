-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('income', 'expense', 'transfer');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('bank', 'cash', 'credit_card', 'e_money');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "public"."ParentType" AS ENUM ('fixed', 'variable', 'regular', 'temporary');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('cash', 'credit', 'e_money');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('JPY', 'USD');

-- CreateEnum
CREATE TYPE "public"."BudgetPeriod" AS ENUM ('monthly');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."budget_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."AccountType" NOT NULL,
    "balance" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'JPY',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CategoryType" NOT NULL,
    "parentType" "public"."ParentType" NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod",
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringDay" INTEGER,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction_templates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod",
    "description" TEXT,

    CONSTRAINT "transaction_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."budgets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "period" "public"."BudgetPeriod" NOT NULL DEFAULT 'monthly',
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."simulations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "events" JSONB NOT NULL,
    "result" JSONB NOT NULL,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "public"."verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_categoryId_year_month_key" ON "public"."budgets"("categoryId", "year", "month");
