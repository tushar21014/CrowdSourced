/*
  Warnings:

  - You are about to drop the column `companyId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_companyId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "companyId";
