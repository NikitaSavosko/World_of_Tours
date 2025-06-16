/*
  Warnings:

  - Made the column `postId` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tourPostId` on table `Like` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "postId" SET NOT NULL,
ALTER COLUMN "tourPostId" SET NOT NULL;
