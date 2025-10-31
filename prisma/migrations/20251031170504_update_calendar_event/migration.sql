/*
  Warnings:

  - The primary key for the `calendar_event` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "calendar_event" DROP CONSTRAINT "calendar_event_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "calendar_event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "calendar_event_id_seq";
