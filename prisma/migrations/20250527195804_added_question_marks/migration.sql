-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "tourFirmId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PhotoGallery" ALTER COLUMN "tourPostId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "tourPostId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Saved" ALTER COLUMN "userId" DROP NOT NULL;
