import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(5, "Name must be at least 5 characters long")
      .max(30, "Name must be at most 30 characters long"),

    email: z.email("Invalid email address"),

    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 characters long")
      .max(14, "Contact number must be at most 14 characters long"),

    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be at most 100 characters long"),

    registrationNumber: z.string("Registration number is required"),

    experience: z
      .int("Experience is required")
      .nonnegative("experience cannot be negative")
      .optional(),

    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be either 'MALE' or 'FEMALE'",
    ),

    appointmentFee: z
      .number("Appointment fee is required")
      .nonnegative("Appointment fee cannot be negative"),

    qualifications: z
      .string("Qualification is required")
      .min(2, "Qualification must be at least 2 characters long")
      .max(50, "Qualification must be at most 50 characters long"),

    currentWorkingPlace: z
      .string("Current working place is required")
      .min(2, "Current working place must be at least 2 characters long")
      .max(50, "Current working place must be at most 50 characters long"),

    designation: z
      .string("Designation is required")
      .min(2, "Designation must be at least 2 characters long")
      .max(50, "Designation must be at most 50 characters long"),
  }),
  specialties: z
    .array(z.uuid(), "Specialty must be an array of strings")
    .min(1, "At least one specialty is required"),
});
