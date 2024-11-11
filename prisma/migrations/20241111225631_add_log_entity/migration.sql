/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `logo` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_createdBy_fkey";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "updatedAt",
ADD COLUMN     "logo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "hecho_por" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalles" JSONB NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_hecho_por_fkey" FOREIGN KEY ("hecho_por") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
