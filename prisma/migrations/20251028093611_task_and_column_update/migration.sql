/*
  Warnings:

  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_column` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."task" DROP CONSTRAINT "task_column_id_fkey";

-- AlterTable
ALTER TABLE "task" DROP CONSTRAINT "task_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "column_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_id_seq";

-- AlterTable
ALTER TABLE "task_column" DROP CONSTRAINT "task_column_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_column_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_column_id_seq";

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "task_column"("id") ON DELETE CASCADE ON UPDATE CASCADE;
