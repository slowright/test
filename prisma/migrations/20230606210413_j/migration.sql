/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `UnVerificationUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_id_key" ON "RefreshToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UnVerificationUser_id_key" ON "UnVerificationUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
