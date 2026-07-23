/*
  Warnings:

  - Added the required column `user_id` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "notes_user_id_idx" ON "notes"("user_id");
