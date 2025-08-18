import { z } from "zod";

// 1️⃣ Base schema — contains all possible fields
export const baseUserSchema = z.object({
  name: z.string().min(6, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/\S/, "Password cannot be just whitespace"),
  confirmPassword: z.string(),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits and only numbers." })
    .optional(),
});






