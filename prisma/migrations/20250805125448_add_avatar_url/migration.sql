-- AlterTable
ALTER TABLE `User` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `UserProfile` ADD COLUMN `avatar` VARCHAR(191) NULL;
