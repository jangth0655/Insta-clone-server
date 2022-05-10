/*
  Warnings:

  - You are about to drop the column `caption` on the `Hashtag` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `Hashtag` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Hashtag` table. All the data in the column will be lost.
  - Added the required column `hashtag` to the `Hashtag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_userId_fkey";

-- AlterTable
ALTER TABLE "Hashtag" DROP COLUMN "caption",
DROP COLUMN "file",
DROP COLUMN "userId",
ADD COLUMN     "hashtag" TEXT NOT NULL;
