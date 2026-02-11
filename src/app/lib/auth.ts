import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import ms, { StringValue } from "ms";
import { envVars } from "../../config/env";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5000"],
  advanced: {
    disableCSRFCheck: true, // Disable CSRF check for development (not recommended for production)
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT, // Default role is "patient"
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needsPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },
});
