import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
  const statusCode: number = status.BAD_REQUEST;
  const message: string = "Validation Error";
  const errorSources: TErrorSource[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode,
  };
};
