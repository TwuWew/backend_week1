-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `ToDo_userId_fkey`;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
