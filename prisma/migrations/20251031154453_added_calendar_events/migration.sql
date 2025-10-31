-- CreateTable
CREATE TABLE "calendar_event" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TEXT,
    "duration" INTEGER,
    "all_day" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calendar_event_user_id_idx" ON "calendar_event"("user_id");

-- CreateIndex
CREATE INDEX "calendar_event_date_idx" ON "calendar_event"("date");

-- CreateIndex
CREATE INDEX "calendar_event_user_id_date_idx" ON "calendar_event"("user_id", "date");

-- AddForeignKey
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
