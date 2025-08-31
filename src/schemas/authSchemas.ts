import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain a lowercase letter",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must include an uppercase letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must include a number",
  })
  .refine((val) => /[^a-zA-Z0-9]/.test(val), {
    message: "Password must include a special character",
  });

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .regex(emailRegex, "Please enter a valid email address");

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Indicates which field the error applies to
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Only digits allowed"),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, "Please provide your first name")
      .min(2, "Please enter a valid name")
      .max(50, "Please enter a valid name"),

    email: emailSchema,
    password: passwordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginShema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginShema>;
export type VerifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
