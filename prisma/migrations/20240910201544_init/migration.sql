/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "files_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "files_name_ownerId_key" ON "files"("name", "ownerId");
