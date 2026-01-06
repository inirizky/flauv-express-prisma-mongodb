-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userPlant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `care_instructions` TEXT NULL,
    `water_frequency` INTEGER NOT NULL,
    `sunlight` VARCHAR(255) NULL,
    `soilType` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `plantBaseId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plantBase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `water_frequency` INTEGER NULL,
    `sunlight` VARCHAR(255) NULL,
    `soilType` VARCHAR(255) NULL,
    `care_instructions` TEXT NULL,
    `isVerifed` BOOLEAN NOT NULL DEFAULT false,
    `generateBy` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plantProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userPlantId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(255) NULL,
    `notes` VARCHAR(255) NULL,
    `sunlight` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userPlant` ADD CONSTRAINT `userPlant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userPlant` ADD CONSTRAINT `userPlant_plantBaseId_fkey` FOREIGN KEY (`plantBaseId`) REFERENCES `plantBase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plantProgress` ADD CONSTRAINT `plantProgress_userPlantId_fkey` FOREIGN KEY (`userPlantId`) REFERENCES `userPlant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
