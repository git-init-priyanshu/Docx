/*
  Warnings:

  - You are about to drop the column `verifyToken` on the `User` table. All the data in the column will be lost.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifyToken",
ADD COLUMN     "picture" TEXT NOT NULL;
