/*
  Warnings:

  - The `category` column on the `project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectCategoryKey" AS ENUM ('other', 'wood', 'art', 'design', 'photography', 'engineering', 'work', 'programming');

-- AlterTable
ALTER TABLE "project" DROP COLUMN "category",
ADD COLUMN     "category" "ProjectCategoryKey" NOT NULL DEFAULT 'other';
