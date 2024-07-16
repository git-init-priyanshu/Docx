/*
  Warnings:

  - Made the column `data` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "data" SET NOT NULL,
ALTER COLUMN "data" SET DATA TYPE TEXT;
