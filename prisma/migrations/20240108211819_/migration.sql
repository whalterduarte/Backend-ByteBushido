/*
  Warnings:

  - You are about to drop the column `slug` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `subcategorias` table. All the data in the column will be lost.
  - Added the required column `slugCursos` to the `cursos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugSubCategory` to the `subcategorias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cursos` DROP COLUMN `slug`,
    ADD COLUMN `slugCursos` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subcategorias` DROP COLUMN `slug`,
    ADD COLUMN `slugSubCategory` VARCHAR(191) NOT NULL;
