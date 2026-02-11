import status from "http-status";
import { Role, Specialty, Gender } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];

  for (const specialId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialId,
      },
    });
    if (!specialty) {
      throw new AppError(
        status.BAD_REQUEST,
        `Specialty with id ${specialId} not found`,
      );
    }
    specialties.push(specialty);
  }
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });
  if (userExists) {
    throw new AppError(
      status.BAD_REQUEST,
      "User with this email already exists",
    );
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needsPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });
      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });
      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          designation: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              isDeleted: true,
              deletedAt: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          currentWorkingPlace: true,
          gender: true,
          appointmentFee: true,
          qualifications: true,
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction error:", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

export const UserService = {
  createDoctor,
};
