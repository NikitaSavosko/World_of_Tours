/*
  Warnings:

  - You are about to drop the `Reviews` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tourPostId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_tourPostId_fkey";

-- DropIndex
DROP INDEX "Like_userId_postId_tourPostId_idx";

-- DropIndex
DROP INDEX "Like_userId_postId_tourPostId_key";

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "tourPostId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TourPost" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Reviews";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "tourPostId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourPostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Saved_userId_tourPostId_key" ON "Saved"("userId", "tourPostId");

-- CreateIndex
CREATE INDEX "Like_userId_postId_idx" ON "Like"("userId", "postId");

-- CreateIndex
CREATE INDEX "Like_userId_tourPostId_idx" ON "Like"("userId", "tourPostId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_tourPostId_key" ON "Like"("userId", "tourPostId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tourPostId_fkey" FOREIGN KEY ("tourPostId") REFERENCES "TourPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_tourPostId_fkey" FOREIGN KEY ("tourPostId") REFERENCES "TourPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
