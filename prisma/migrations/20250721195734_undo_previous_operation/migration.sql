/*
  Warnings:

  - Added the required column `page_id` to the `task_column` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_column" ADD COLUMN     "page_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "task_column" ADD CONSTRAINT "task_column_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
