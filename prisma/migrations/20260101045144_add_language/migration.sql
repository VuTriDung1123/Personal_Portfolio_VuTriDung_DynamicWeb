-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'vi',
ALTER COLUMN "images" SET DEFAULT '[]';
