import { z } from "zod";

export const candidateRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  registrationNo: z.string().trim().min(3, "Registration number is required").max(64),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z.string().trim().min(7).max(32),
  faculty: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(120),
  course: z.string().trim().min(2).max(120),
  yearOfStudy: z.string().trim().min(1).max(40),
  intendedPosition: z.string().trim().min(2).max(120),
  biography: z.string().trim().min(20).max(5000),
  manifesto: z.string().trim().min(20).max(10000),
});
