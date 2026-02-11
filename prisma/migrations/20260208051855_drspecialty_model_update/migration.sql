/*
  Warnings:

  - The primary key for the `doctor_specialties` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_pkey",
ADD CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("id");
