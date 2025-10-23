/*
  Warnings:

  - Added the required column `user_id` to the `task_column` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_column" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT 'QMZ2fTk3rg6eSwrMNPgXsEydiKsub9Qd';

-- Update rows that have just been given the default, so we can safely remove the default afterwards
-- (Optional, but ensures migration works even if inserted concurrently)
UPDATE "task_column" SET "user_id" = 'QMZ2fTk3rg6eSwrMNPgXsEydiKsub9Qd' WHERE "user_id" IS NULL;

-- Remove the default so future inserts must specify user_id
ALTER TABLE "task_column" ALTER COLUMN "user_id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "task_column" ADD CONSTRAINT "task_column_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
