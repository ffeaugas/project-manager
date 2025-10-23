/*
  Warnings:

  - Added the required column `user_id` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'QMZ2fTk3rg6eSwrMNPgXsEydiKsub9Qd';

-- Update rows that have just been given the default, so we can safely remove the default afterwards
UPDATE "project" SET "user_id" = 'QMZ2fTk3rg6eSwrMNPgXsEydiKsub9Qd' WHERE "user_id" IS NULL;

-- Remove the default so future inserts must specify user_id
ALTER TABLE "project" ALTER COLUMN "user_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
