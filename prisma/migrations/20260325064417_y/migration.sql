/*
  Warnings:

  - You are about to drop the column `description` on the `tbl_consultation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tbl_violation_report` table. All the data in the column will be lost.
  - You are about to drop the `tbl_document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbl_document` DROP FOREIGN KEY `tbl_document_consultationId_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_document` DROP FOREIGN KEY `tbl_document_violationId_fkey`;

-- AlterTable
ALTER TABLE `tbl_consultation` DROP COLUMN `description`,
    ADD COLUMN `linkFile` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tbl_violation_report` DROP COLUMN `description`,
    ADD COLUMN `linkFile` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `tbl_document`;
