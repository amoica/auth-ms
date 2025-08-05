/*
  Warnings:

  - You are about to drop the column `avatar` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserProfile` DROP COLUMN `avatar`,
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL;
