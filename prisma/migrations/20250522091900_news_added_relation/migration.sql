/*
  Warnings:

  - Added the required column `tourFirmId` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" ADD COLUMN     "tourFirmId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_tourFirmId_fkey" FOREIGN KEY ("tourFirmId") REFERENCES "TourFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
