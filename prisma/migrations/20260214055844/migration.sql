/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,specialtyId]` on the table `doctor_specialties` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialties_doctorId_specialtyId_key" ON "doctor_specialties"("doctorId", "specialtyId");

-- RenameIndex
ALTER INDEX "idx_doctor_specialty_doctor_id" RENAME TO "idx_doctor_specialty_doctorId";

-- RenameIndex
ALTER INDEX "idx_doctor_specialty_specialty_id" RENAME TO "idx_doctor_specialty_specialtyId";
