/*
  Warnings:

  - You are about to drop the column `userId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `referredUserId` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredCompanyId` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referredUserId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referrerId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "userId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "referredUserId",
ADD COLUMN     "referredCompanyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "userId",
ADD COLUMN     "voterId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "totalRewardsEarned" DECIMAL(65,30) NOT NULL DEFAULT 0.00,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "referralCode" TEXT,
    "totalMoneySpent" DECIMAL(65,30) NOT NULL DEFAULT 0.00,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voter_walletAddress_key" ON "Voter"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Company_walletAddress_key" ON "Company"("walletAddress");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredCompanyId_fkey" FOREIGN KEY ("referredCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
