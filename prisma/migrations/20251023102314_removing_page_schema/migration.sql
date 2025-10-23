/*
  Warnings:

  - You are about to drop the column `page_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `page_id` on the `task_column` table. All the data in the column will be lost.
  - You are about to drop the `page` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."task" DROP CONSTRAINT "task_page_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."task_column" DROP CONSTRAINT "task_column_page_id_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "page_id";

-- AlterTable
ALTER TABLE "task_column" DROP COLUMN "page_id";

-- DropTable
DROP TABLE "public"."page";
