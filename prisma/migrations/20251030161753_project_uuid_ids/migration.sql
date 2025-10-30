/*
  Warnings:

  - The primary key for the `project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `project_card` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."image" DROP CONSTRAINT "image_project_card_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."project_card" DROP CONSTRAINT "project_card_project_id_fkey";

-- AlterTable
ALTER TABLE "image" ALTER COLUMN "project_card_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "project" DROP CONSTRAINT "project_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "project_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "project_id_seq";

-- AlterTable
ALTER TABLE "project_card" DROP CONSTRAINT "project_card_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "project_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "project_card_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "project_card_id_seq";

-- AddForeignKey
ALTER TABLE "project_card" ADD CONSTRAINT "project_card_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_project_card_id_fkey" FOREIGN KEY ("project_card_id") REFERENCES "project_card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
