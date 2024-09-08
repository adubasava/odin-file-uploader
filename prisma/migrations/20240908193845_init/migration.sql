/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folders_name_ownerId_key" ON "folders"("name", "ownerId");
