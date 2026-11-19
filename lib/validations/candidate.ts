import { z } from "zod";

export const candidateSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(120),
  registrationNo: z.string().trim().min(3, "Registration number is required").max(64),
  course: z.string().trim().max(120).optional(),
  academicYear: z.string().trim().max(40).optional(),
  photoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .max(2048)
    .optional()
    .or(z.literal("")),
  biography: z.string().trim().min(10, "Biography must be at least 10 characters").max(5000),
  manifesto: z.string().trim().min(10, "Manifesto must be at least 10 characters").max(10000),
  slogan: z.string().trim().max(200).optional(),
  status: z.enum(["PENDING", "ACTIVE"]).default("ACTIVE"),
});
