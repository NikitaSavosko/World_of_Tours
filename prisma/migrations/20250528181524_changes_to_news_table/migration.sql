/*
  Warnings:

  - Made the column `tourFirmId` on table `News` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "News" ALTER COLUMN "tourFirmId" SET NOT NULL;
