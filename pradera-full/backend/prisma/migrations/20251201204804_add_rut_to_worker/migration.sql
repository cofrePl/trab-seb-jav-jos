/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "rut" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Worker_rut_key" ON "Worker"("rut");
