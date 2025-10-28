/*
  Warnings:

  - Added the required column `user_id` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "order" DROP DEFAULT,
ALTER COLUMN "order" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "task_column" ALTER COLUMN "order" DROP DEFAULT,
ALTER COLUMN "order" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
