/*
  Warnings:

  - Added the required column `questionFormId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "questionFormId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "QuestionForm" (
    "id" SERIAL NOT NULL,
    "QuestionFormId" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "voteLimit" INTEGER NOT NULL,
    "totalReward" DECIMAL(65,30) NOT NULL,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "rewardPerVote" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionForm" ADD CONSTRAINT "QuestionForm_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_questionFormId_fkey" FOREIGN KEY ("questionFormId") REFERENCES "QuestionForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
