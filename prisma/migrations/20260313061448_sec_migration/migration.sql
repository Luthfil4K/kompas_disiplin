/*
  Warnings:

  - You are about to drop the `consultation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `followup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `violationreport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `violationtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workunit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `consultation` DROP FOREIGN KEY `Consultation_workUnitId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_consultationId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_violationId_fkey`;

-- DropForeignKey
ALTER TABLE `followup` DROP FOREIGN KEY `FollowUp_consultationId_fkey`;

-- DropForeignKey
ALTER TABLE `followup` DROP FOREIGN KEY `FollowUp_userId_fkey`;

-- DropForeignKey
ALTER TABLE `followup` DROP FOREIGN KEY `FollowUp_violationId_fkey`;

-- DropForeignKey
ALTER TABLE `violationreport` DROP FOREIGN KEY `ViolationReport_violationTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `violationreport` DROP FOREIGN KEY `ViolationReport_workUnitId_fkey`;

-- DropTable
DROP TABLE `consultation`;

-- DropTable
DROP TABLE `document`;

-- DropTable
DROP TABLE `followup`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `violationreport`;

-- DropTable
DROP TABLE `violationtype`;

-- DropTable
DROP TABLE `workunit`;

-- CreateTable
CREATE TABLE `tbl_user` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'KABAG_TU', 'KAPROV', 'KABKO_KATIM') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_user_nip_key`(`nip`),
    UNIQUE INDEX `tbl_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_work_unit` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_consultation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `workUnitId` VARCHAR(191) NOT NULL,
    `status` ENUM('SUBMITTED', 'IN_REVIEW', 'FOLLOWED_UP', 'COMPLETED') NOT NULL DEFAULT 'SUBMITTED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_violation_report` (
    `id` VARCHAR(191) NOT NULL,
    `reporterName` VARCHAR(191) NOT NULL,
    `reportedName` VARCHAR(191) NOT NULL,
    `reportedNip` VARCHAR(191) NOT NULL,
    `reportedPosition` VARCHAR(191) NOT NULL,
    `violationTypeId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `workUnitId` VARCHAR(191) NOT NULL,
    `status` ENUM('SUBMITTED', 'IN_REVIEW', 'FOLLOWED_UP', 'COMPLETED') NOT NULL DEFAULT 'SUBMITTED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_violation_type` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_document` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `consultationId` VARCHAR(191) NULL,
    `violationId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_follow_up` (
    `id` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `consultationId` VARCHAR(191) NULL,
    `violationId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_consultation` ADD CONSTRAINT `tbl_consultation_workUnitId_fkey` FOREIGN KEY (`workUnitId`) REFERENCES `tbl_work_unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_violation_report` ADD CONSTRAINT `tbl_violation_report_violationTypeId_fkey` FOREIGN KEY (`violationTypeId`) REFERENCES `tbl_violation_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_violation_report` ADD CONSTRAINT `tbl_violation_report_workUnitId_fkey` FOREIGN KEY (`workUnitId`) REFERENCES `tbl_work_unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_document` ADD CONSTRAINT `tbl_document_consultationId_fkey` FOREIGN KEY (`consultationId`) REFERENCES `tbl_consultation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_document` ADD CONSTRAINT `tbl_document_violationId_fkey` FOREIGN KEY (`violationId`) REFERENCES `tbl_violation_report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_follow_up` ADD CONSTRAINT `tbl_follow_up_consultationId_fkey` FOREIGN KEY (`consultationId`) REFERENCES `tbl_consultation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_follow_up` ADD CONSTRAINT `tbl_follow_up_violationId_fkey` FOREIGN KEY (`violationId`) REFERENCES `tbl_violation_report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_follow_up` ADD CONSTRAINT `tbl_follow_up_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `tbl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
