/*
  Warnings:

  - Made the column `userId` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Saved` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Saved" ALTER COLUMN "userId" SET NOT NULL;
