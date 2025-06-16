/*
  Warnings:

  - The `deadline` column on the `News` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "deadline",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
