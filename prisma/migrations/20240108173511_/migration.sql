/*
  Warnings:

  - You are about to drop the column `photo` on the `cursos` table. All the data in the column will be lost.
  - Added the required column `photo` to the `categorias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file` to the `cursos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `subcategorias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categorias` ADD COLUMN `photo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `cursos` DROP COLUMN `photo`,
    ADD COLUMN `file` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subcategorias` ADD COLUMN `photo` VARCHAR(191) NOT NULL;
