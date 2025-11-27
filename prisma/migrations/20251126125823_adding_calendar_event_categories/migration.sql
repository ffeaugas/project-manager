/*
  Warnings:

  - The `category` column on the `calendar_event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CalendarEventCategoryKey" AS ENUM ('default', 'social', 'work', 'birthday', 'important', 'culture');

-- AlterTable
ALTER TABLE "calendar_event" DROP COLUMN "category",
ADD COLUMN     "category" "CalendarEventCategoryKey" NOT NULL DEFAULT 'default';
