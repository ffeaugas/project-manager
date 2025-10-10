/*
  Warnings:

  - You are about to drop the column `page_id` on the `task_column` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_column" DROP CONSTRAINT "task_column_page_id_fkey";

-- AlterTable
ALTER TABLE "task_column" DROP COLUMN "page_id";
